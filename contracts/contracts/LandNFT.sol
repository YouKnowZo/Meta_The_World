// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title LandNFT
 * @dev NFT contract for virtual land ownership in Meta The World
 */
contract LandNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _tokenIdCounter;
    uint256 public constant MAX_SUPPLY = 1000000; // 1 million parcels
    
    // Land parcel structure
    struct LandParcel {
        uint256 tokenId;
        uint256 x;
        uint256 y;
        uint256 size; // in square meters
        string metadata;
        bool forSale;
        uint256 price;
    }
    
    mapping(uint256 => LandParcel) public landParcels;
    mapping(uint256 => mapping(uint256 => uint256)) public coordinatesToTokenId; // x,y -> tokenId
    
    // Real estate agent commission (default 3%)
    uint256 public constant AGENT_COMMISSION_RATE = 300; // 3% = 300 basis points
    mapping(address => bool) public registeredAgents;
    
    event LandMinted(uint256 indexed tokenId, address indexed owner, uint256 x, uint256 y);
    event LandListed(uint256 indexed tokenId, uint256 price);
    event LandSold(uint256 indexed tokenId, address indexed buyer, address indexed seller, uint256 price, uint256 commission);
    event AgentRegistered(address indexed agent);
    
    constructor() ERC721("MetaTheWorld Land", "MTWL") Ownable(msg.sender) {}
    
    /**
     * @dev Mint a new land parcel
     */
    function mintLand(
        address to,
        uint256 x,
        uint256 y,
        uint256 size,
        string memory metadata,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        require(_tokenIdCounter < MAX_SUPPLY, "Max supply reached");
        require(coordinatesToTokenId[x][y] == 0, "Land already exists at these coordinates");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        landParcels[tokenId] = LandParcel({
            tokenId: tokenId,
            x: x,
            y: y,
            size: size,
            metadata: metadata,
            forSale: false,
            price: 0
        });
        
        coordinatesToTokenId[x][y] = tokenId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        emit LandMinted(tokenId, to, x, y);
        return tokenId;
    }
    
    /**
     * @dev List land for sale
     */
    function listForSale(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(price > 0, "Price must be greater than 0");
        
        landParcels[tokenId].forSale = true;
        landParcels[tokenId].price = price;
        
        emit LandListed(tokenId, price);
    }
    
    /**
     * @dev Purchase land with agent commission
     */
    function purchaseLand(uint256 tokenId, address agent) public payable nonReentrant {
        LandParcel memory parcel = landParcels[tokenId];
        require(parcel.forSale, "Land not for sale");
        require(msg.value >= parcel.price, "Insufficient payment");
        
        address seller = ownerOf(tokenId);
        require(seller != msg.sender, "Cannot buy your own land");
        
        uint256 commission = 0;
        address agentToPay = address(0);
        
        // Calculate commission if agent is registered
        if (agent != address(0) && registeredAgents[agent]) {
            commission = (parcel.price * AGENT_COMMISSION_RATE) / 10000;
            agentToPay = agent;
        }
        
        uint256 sellerAmount = parcel.price - commission;
        
        // Transfer ownership
        _transfer(seller, msg.sender, tokenId);
        
        // Update parcel status
        landParcels[tokenId].forSale = false;
        landParcels[tokenId].price = 0;
        
        // Transfer payments
        if (commission > 0) {
            payable(agentToPay).transfer(commission);
        }
        payable(seller).transfer(sellerAmount);
        
        // Refund excess payment
        if (msg.value > parcel.price) {
            payable(msg.sender).transfer(msg.value - parcel.price);
        }
        
        emit LandSold(tokenId, msg.sender, seller, parcel.price, commission);
    }
    
    /**
     * @dev Register as a real estate agent
     */
    function registerAgent() public {
        registeredAgents[msg.sender] = true;
        emit AgentRegistered(msg.sender);
    }
    
    /**
     * @dev Get land parcel details
     */
    function getLandParcel(uint256 tokenId) public view returns (LandParcel memory) {
        return landParcels[tokenId];
    }
    
    /**
     * @dev Get token ID by coordinates
     */
    function getTokenIdByCoordinates(uint256 x, uint256 y) public view returns (uint256) {
        return coordinatesToTokenId[x][y];
    }
}
