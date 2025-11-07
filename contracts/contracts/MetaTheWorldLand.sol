// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract MetaTheWorldLand is ERC721, ERC721Enumerable, Ownable, ReentrancyGuard {
    struct LandParcel {
        uint256 id;
        uint256 x;
        uint256 z;
        uint256 price;
        bool forSale;
        address owner;
    }

    uint256 private _nextTokenId;
    uint256 public constant GRID_SIZE = 20;
    uint256 public constant MAX_LANDS = GRID_SIZE * GRID_SIZE;
    
    mapping(uint256 => LandParcel) public lands;
    mapping(uint256 => uint256) public landPrices;
    mapping(uint256 => bool) public landForSale;
    
    uint256 public basePrice = 0.1 ether;
    
    event LandPurchased(uint256 indexed tokenId, uint256 indexed x, uint256 indexed z, address buyer, uint256 price);
    event LandListed(uint256 indexed tokenId, uint256 price);
    event LandDelisted(uint256 indexed tokenId);

    constructor(address initialOwner) ERC721("MetaTheWorldLand", "MTWL") Ownable(initialOwner) {
        _nextTokenId = 1;
    }

    function purchaseLand(uint256 x, uint256 z) external payable nonReentrant {
        require(x < GRID_SIZE && z < GRID_SIZE, "Coordinates out of bounds");
        uint256 landId = x * GRID_SIZE + z;
        require(!_exists(landId), "Land already owned");
        
        uint256 price = landPrices[landId] > 0 ? landPrices[landId] : basePrice;
        require(msg.value >= price, "Insufficient payment");
        
        uint256 tokenId = landId;
        _safeMint(msg.sender, tokenId);
        
        lands[tokenId] = LandParcel({
            id: tokenId,
            x: x,
            z: z,
            price: price,
            forSale: false,
            owner: msg.sender
        });
        
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
        
        emit LandPurchased(tokenId, x, z, msg.sender, price);
    }

    function purchaseExistingLand(uint256 tokenId) external payable nonReentrant {
        require(_exists(tokenId), "Land does not exist");
        require(landForSale[tokenId], "Land is not for sale");
        
        uint256 price = landPrices[tokenId];
        require(msg.value >= price, "Insufficient payment");
        
        address previousOwner = ownerOf(tokenId);
        _transfer(previousOwner, msg.sender, tokenId);
        
        lands[tokenId].owner = msg.sender;
        lands[tokenId].forSale = false;
        landForSale[tokenId] = false;
        
        payable(previousOwner).transfer(price);
        
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
        
        emit LandPurchased(tokenId, lands[tokenId].x, lands[tokenId].z, msg.sender, price);
    }

    function listLandForSale(uint256 tokenId, uint256 price) external {
        require(_exists(tokenId), "Land does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(price > 0, "Price must be greater than 0");
        
        landForSale[tokenId] = true;
        landPrices[tokenId] = price;
        lands[tokenId].forSale = true;
        lands[tokenId].price = price;
        
        emit LandListed(tokenId, price);
    }

    function delistLand(uint256 tokenId) external {
        require(_exists(tokenId), "Land does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        
        landForSale[tokenId] = false;
        lands[tokenId].forSale = false;
        
        emit LandDelisted(tokenId);
    }

    function getLand(uint256 tokenId) external view returns (LandParcel memory) {
        require(_exists(tokenId), "Land does not exist");
        return lands[tokenId];
    }

    function getLandByCoordinates(uint256 x, uint256 z) external view returns (LandParcel memory) {
        require(x < GRID_SIZE && z < GRID_SIZE, "Coordinates out of bounds");
        uint256 tokenId = x * GRID_SIZE + z;
        require(_exists(tokenId), "Land does not exist");
        return lands[tokenId];
    }

    function getUserLands(address user) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(user);
        uint256[] memory tokenIds = new uint256[](balance);
        
        for (uint256 i = 0; i < balance; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(user, i);
        }
        
        return tokenIds;
    }

    function setBasePrice(uint256 newPrice) external onlyOwner {
        basePrice = newPrice;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Required overrides
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
