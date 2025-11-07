// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title MetaWorldLand
 * @dev NFT contract for virtual land parcels in Meta The World
 */
contract MetaWorldLand is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Land parcel structure
    struct LandParcel {
        int256 x;
        int256 y;
        int256 z;
        uint256 size;
        string landType;
        uint256 mintedAt;
    }

    // Mapping from token ID to land parcel data
    mapping(uint256 => LandParcel) public landParcels;
    
    // Mapping from coordinates to token ID (for uniqueness)
    mapping(bytes32 => uint256) public coordinatesToTokenId;
    
    // Base price for land parcels
    uint256 public basePrice = 0.1 ether;
    
    // Events
    event LandMinted(
        uint256 indexed tokenId,
        address indexed owner,
        int256 x,
        int256 y,
        int256 z,
        uint256 size
    );
    
    event LandUpdated(uint256 indexed tokenId, string newURI);

    constructor() ERC721("Meta World Land", "MWL") Ownable(msg.sender) {}

    /**
     * @dev Mint a new land parcel
     */
    function mintLand(
        int256 x,
        int256 y,
        int256 z,
        uint256 size,
        string memory landType,
        string memory uri
    ) public payable returns (uint256) {
        require(msg.value >= basePrice, "Insufficient payment");
        
        bytes32 coordHash = keccak256(abi.encodePacked(x, y, z));
        require(coordinatesToTokenId[coordHash] == 0, "Land already minted");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        
        landParcels[tokenId] = LandParcel({
            x: x,
            y: y,
            z: z,
            size: size,
            landType: landType,
            mintedAt: block.timestamp
        });
        
        coordinatesToTokenId[coordHash] = tokenId + 1; // +1 to differentiate from default 0
        
        emit LandMinted(tokenId, msg.sender, x, y, z, size);
        
        return tokenId;
    }

    /**
     * @dev Batch mint multiple land parcels
     */
    function batchMintLand(
        int256[] memory xCoords,
        int256[] memory yCoords,
        int256[] memory zCoords,
        uint256[] memory sizes,
        string[] memory landTypes,
        string[] memory uris
    ) public payable returns (uint256[] memory) {
        require(
            xCoords.length == yCoords.length &&
            yCoords.length == zCoords.length &&
            zCoords.length == sizes.length &&
            sizes.length == landTypes.length &&
            landTypes.length == uris.length,
            "Array length mismatch"
        );
        
        require(msg.value >= basePrice * xCoords.length, "Insufficient payment");
        
        uint256[] memory tokenIds = new uint256[](xCoords.length);
        
        for (uint256 i = 0; i < xCoords.length; i++) {
            bytes32 coordHash = keccak256(abi.encodePacked(xCoords[i], yCoords[i], zCoords[i]));
            require(coordinatesToTokenId[coordHash] == 0, "Land already minted");
            
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            
            _safeMint(msg.sender, tokenId);
            _setTokenURI(tokenId, uris[i]);
            
            landParcels[tokenId] = LandParcel({
                x: xCoords[i],
                y: yCoords[i],
                z: zCoords[i],
                size: sizes[i],
                landType: landTypes[i],
                mintedAt: block.timestamp
            });
            
            coordinatesToTokenId[coordHash] = tokenId + 1;
            tokenIds[i] = tokenId;
            
            emit LandMinted(tokenId, msg.sender, xCoords[i], yCoords[i], zCoords[i], sizes[i]);
        }
        
        return tokenIds;
    }

    /**
     * @dev Update land metadata URI
     */
    function updateLandURI(uint256 tokenId, string memory newURI) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        _setTokenURI(tokenId, newURI);
        emit LandUpdated(tokenId, newURI);
    }

    /**
     * @dev Get land parcel details
     */
    function getLandParcel(uint256 tokenId) public view returns (LandParcel memory) {
        require(_ownerOf(tokenId) != address(0), "Land does not exist");
        return landParcels[tokenId];
    }

    /**
     * @dev Check if coordinates are available
     */
    function isCoordinateAvailable(int256 x, int256 y, int256 z) public view returns (bool) {
        bytes32 coordHash = keccak256(abi.encodePacked(x, y, z));
        return coordinatesToTokenId[coordHash] == 0;
    }

    /**
     * @dev Set base price (owner only)
     */
    function setBasePrice(uint256 newPrice) public onlyOwner {
        basePrice = newPrice;
    }

    /**
     * @dev Withdraw contract balance (owner only)
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        payable(owner()).transfer(balance);
    }

    /**
     * @dev Get total minted lands
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    // Required overrides
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
