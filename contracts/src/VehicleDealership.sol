// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RoyaltyDistributor.sol";

/**
 * @title VehicleDealership
 * @dev Handles showroom listings, sales, and tuning for vehicles.
 */
contract VehicleDealership is Ownable, ERC721Holder {
    IERC20 public mtwToken;
    RoyaltyDistributor public royaltyDistributor;
    
    struct Listing {
        address seller;
        uint256 price;
        bool active;
        address registry;
    }

    mapping(uint256 => Listing) public vehicleListings; // tokenId => Listing

    uint256 public feeBps = 500; // 5%

    event VehicleListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event VehicleSold(uint256 indexed tokenId, address indexed buyer, uint256 price);

    constructor(address _mtwToken, address _royaltyDistributor) Ownable(msg.sender) {
        mtwToken = IERC20(_mtwToken);
        royaltyDistributor = RoyaltyDistributor(_royaltyDistributor);
    }

    function listVehicle(address registry, uint256 tokenId, uint256 price) external {
        IERC721(registry).safeTransferFrom(msg.sender, address(this), tokenId);
        vehicleListings[tokenId] = Listing({
            seller: msg.sender,
            price: price,
            active: true,
            registry: registry
        });
        emit VehicleListed(tokenId, msg.sender, price);
    }

    function buyVehicle(uint256 tokenId, uint256 parcelTokenId) external {
        Listing storage listing = vehicleListings[tokenId];
        require(listing.active, "Not for sale");
        
        uint256 price = listing.price;
        uint256 fee = (price * feeBps) / 10000;
        uint256 sellerProceeds = price - fee;

        require(mtwToken.transferFrom(msg.sender, address(this), price), "Transfer failed");
        
        // Handle fee
        mtwToken.approve(address(royaltyDistributor), fee);
        royaltyDistributor.depositRoyalty(parcelTokenId, fee);

        // Handle seller payout
        require(mtwToken.transfer(listing.seller, sellerProceeds), "Seller transfer failed");

        // Transfer vehicle
        IERC721(listing.registry).safeTransferFrom(address(this), msg.sender, tokenId);
        
        listing.active = false;
        emit VehicleSold(tokenId, msg.sender, price);
    }

    function updateFee(uint256 _feeBps) external onlyOwner {
        require(_feeBps <= 1000, "Fee too high");
        feeBps = _feeBps;
    }
}
