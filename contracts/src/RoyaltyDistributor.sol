// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ILandRegistry.sol";

/**
 * @title RoyaltyDistributor
 * @dev Handles distribution of micro-royalties from various economic activities in the Metaverse.
 * Royalties are split between LAND owners, MTW stakers, and the DAO treasury.
 */
contract RoyaltyDistributor is Ownable {
    IERC20 public mtwToken;
    address public landRegistry;
    
    address public stakerPool;
    address public daoTreasury;

    uint256 public constant LAND_OWNER_SHARE = 40; // 40%
    uint256 public constant STAKER_SHARE = 40;     // 40%
    uint256 public constant DAO_SHARE = 20;       // 20%

    // Accumulated royalties per land parcel (tokenId)
    mapping(uint256 => uint256) public parcelRoyalties;

    event RoyaltyReceived(uint256 indexed tokenId, uint256 amount);
    event RoyaltyClaimed(uint256 indexed tokenId, address indexed owner, uint256 amount);
    event PoolRoyaltiesDistributed(uint256 stakerAmount, uint256 daoAmount);

    constructor(
        address _mtwToken, 
        address _landRegistry, 
        address _stakerPool, 
        address _daoTreasury
    ) Ownable(msg.sender) {
        mtwToken = IERC20(_mtwToken);
        landRegistry = _landRegistry;
        stakerPool = _stakerPool;
        daoTreasury = _daoTreasury;
    }

    /**
     * @dev Deposit royalties for a specific parcel.
     * @param tokenId The ID of the land parcel.
     * @param amount The total amount of MTW being deposited.
     */
    function depositRoyalty(uint256 tokenId, uint256 amount) external {
        require(mtwToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        uint256 landShare = (amount * LAND_OWNER_SHARE) / 100;
        uint256 stakerShare = (amount * STAKER_SHARE) / 100;
        uint256 daoShare = amount - landShare - stakerShare;

        parcelRoyalties[tokenId] += landShare;
        
        if (stakerShare > 0) {
            require(mtwToken.transfer(stakerPool, stakerShare), "Staker transfer failed");
        }
        if (daoShare > 0) {
            require(mtwToken.transfer(daoTreasury, daoShare), "DAO transfer failed");
        }

        emit RoyaltyReceived(tokenId, landShare);
        emit PoolRoyaltiesDistributed(stakerShare, daoShare);
    }

    /**
     * @dev Claim accumulated royalties for a parcel. Can be called by anyone but only pays to owner.
     * @param tokenId The ID of the land parcel.
     */
    function claimRoyalty(uint256 tokenId) external {
        address owner = IERC721(landRegistry).ownerOf(tokenId);
        uint256 amount = parcelRoyalties[tokenId];
        require(amount > 0, "No royalties to claim");
        
        parcelRoyalties[tokenId] = 0;
        require(mtwToken.transfer(owner, amount), "Transfer to owner failed");
        
        emit RoyaltyClaimed(tokenId, owner, amount);
    }

    /**
     * @dev Update distribution pool addresses.
     */
    function updatePools(address _stakerPool, address _daoTreasury) external onlyOwner {
        stakerPool = _stakerPool;
        daoTreasury = _daoTreasury;
    }
}
