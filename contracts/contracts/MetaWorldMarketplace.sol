// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MetaWorldMarketplace
 * @dev Marketplace for trading Meta World Land NFTs
 */
contract MetaWorldMarketplace is ReentrancyGuard, Ownable {
    struct Listing {
        address seller;
        uint256 price;
        bool active;
    }

    // NFT contract address
    IERC721 public nftContract;
    
    // Marketplace fee (in basis points, e.g., 250 = 2.5%)
    uint256 public marketplaceFee = 250;
    
    // Mapping from token ID to listing
    mapping(uint256 => Listing) public listings;
    
    // Events
    event ItemListed(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price
    );
    
    event ItemSold(
        uint256 indexed tokenId,
        address indexed seller,
        address indexed buyer,
        uint256 price
    );
    
    event ListingCancelled(uint256 indexed tokenId, address indexed seller);
    event ListingUpdated(uint256 indexed tokenId, uint256 newPrice);

    constructor(address _nftContract) Ownable(msg.sender) {
        nftContract = IERC721(_nftContract);
    }

    /**
     * @dev List an NFT for sale
     */
    function listItem(uint256 tokenId, uint256 price) public nonReentrant {
        require(price > 0, "Price must be greater than 0");
        require(
            nftContract.ownerOf(tokenId) == msg.sender,
            "Not the owner"
        );
        require(
            nftContract.getApproved(tokenId) == address(this) ||
            nftContract.isApprovedForAll(msg.sender, address(this)),
            "Marketplace not approved"
        );
        require(!listings[tokenId].active, "Already listed");

        listings[tokenId] = Listing({
            seller: msg.sender,
            price: price,
            active: true
        });

        emit ItemListed(tokenId, msg.sender, price);
    }

    /**
     * @dev Buy a listed NFT
     */
    function buyItem(uint256 tokenId) public payable nonReentrant {
        Listing memory listing = listings[tokenId];
        require(listing.active, "Item not listed");
        require(msg.value >= listing.price, "Insufficient payment");
        require(
            nftContract.ownerOf(tokenId) == listing.seller,
            "Seller no longer owns the item"
        );

        // Calculate fees
        uint256 fee = (listing.price * marketplaceFee) / 10000;
        uint256 sellerProceeds = listing.price - fee;

        // Mark as inactive
        listings[tokenId].active = false;

        // Transfer NFT to buyer
        nftContract.safeTransferFrom(listing.seller, msg.sender, tokenId);

        // Transfer payment to seller
        payable(listing.seller).transfer(sellerProceeds);

        // Refund excess payment
        if (msg.value > listing.price) {
            payable(msg.sender).transfer(msg.value - listing.price);
        }

        emit ItemSold(tokenId, listing.seller, msg.sender, listing.price);
    }

    /**
     * @dev Cancel a listing
     */
    function cancelListing(uint256 tokenId) public nonReentrant {
        Listing memory listing = listings[tokenId];
        require(listing.active, "Item not listed");
        require(listing.seller == msg.sender, "Not the seller");

        listings[tokenId].active = false;

        emit ListingCancelled(tokenId, msg.sender);
    }

    /**
     * @dev Update listing price
     */
    function updateListing(uint256 tokenId, uint256 newPrice) public nonReentrant {
        require(newPrice > 0, "Price must be greater than 0");
        Listing storage listing = listings[tokenId];
        require(listing.active, "Item not listed");
        require(listing.seller == msg.sender, "Not the seller");

        listing.price = newPrice;

        emit ListingUpdated(tokenId, newPrice);
    }

    /**
     * @dev Get listing details
     */
    function getListing(uint256 tokenId) public view returns (Listing memory) {
        return listings[tokenId];
    }

    /**
     * @dev Set marketplace fee (owner only)
     */
    function setMarketplaceFee(uint256 newFee) public onlyOwner {
        require(newFee <= 1000, "Fee too high"); // Max 10%
        marketplaceFee = newFee;
    }

    /**
     * @dev Withdraw accumulated fees (owner only)
     */
    function withdrawFees() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        payable(owner()).transfer(balance);
    }

    /**
     * @dev Update NFT contract address (owner only)
     */
    function setNFTContract(address _nftContract) public onlyOwner {
        nftContract = IERC721(_nftContract);
    }
}
