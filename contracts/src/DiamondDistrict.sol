// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import "./RoyaltyDistributor.sol";

/**
 * @title DiamondDistrict
 * @dev Provably fair gambling protocol using Chainlink VRF v2.5.
 * Fees are automatically routed to the RoyaltyDistributor for the parcel where the bet occurred.
 */
contract DiamondDistrict is VRFConsumerBaseV2Plus {
    IERC20 public mtwToken;
    RoyaltyDistributor public royaltyDistributor;
    
    // Chainlink VRF variables
    uint256 public s_subscriptionId;
    bytes32 public keyHash;
    uint32 public callbackGasLimit = 100000;
    uint16 public requestConfirmations = 3;
    uint32 public numWords = 1;

    struct Bet {
        address player;
        uint256 amount;
        uint256 tokenId; // Land parcel where the bet was placed
        uint8 gameType; // 0: Dice, 1: CoinFlip, 2: Roulette
        bool resolved;
        uint256 result;
        uint256 winAmount;
    }

    mapping(uint256 => Bet) public bets; // requestId => Bet

    uint256 public houseEdgeBps = 300; // 3%

    event BetPlaced(uint256 indexed requestId, address indexed player, uint256 amount, uint8 gameType);
    event BetResolved(uint256 indexed requestId, uint256 result, uint256 winAmount);

    constructor(
        address _mtwToken,
        address _royaltyDistributor,
        address _vrfCoordinator,
        uint256 _subscriptionId,
        bytes32 _keyHash
    ) VRFConsumerBaseV2Plus(_vrfCoordinator) {
        mtwToken = IERC20(_mtwToken);
        royaltyDistributor = RoyaltyDistributor(_royaltyDistributor);
        s_subscriptionId = _subscriptionId;
        keyHash = _keyHash;
    }

    /**
     * @dev Places a bet in the Diamond District.
     * @param amount The amount of MTW to bet.
     * @param tokenId The land parcel where the bet is being placed.
     * @param gameType The type of game (0: Dice, 1: CoinFlip, 2: Roulette).
     */
    function placeBet(uint256 amount, uint256 tokenId, uint8 gameType) external returns (uint256 requestId) {
        require(amount > 0, "Amount must be > 0");
        require(mtwToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: keyHash,
                subId: s_subscriptionId,
                requestConfirmations: requestConfirmations,
                callbackGasLimit: callbackGasLimit,
                numWords: numWords,
                extraArgs: VRFV2PlusClient._argsToBytes(VRFV2PlusClient.ExtraArgsV1({nativePayment: false}))
            })
        );

        bets[requestId] = Bet({
            player: msg.sender,
            amount: amount,
            tokenId: tokenId,
            gameType: gameType,
            resolved: false,
            result: 0,
            winAmount: 0
        });

        emit BetPlaced(requestId, msg.sender, amount, gameType);
    }

    /**
     * @dev Callback function called by VRF Coordinator.
     */
    function fulfillRandomWords(uint256 requestId, uint256[] calldata randomWords) internal override {
        Bet storage bet = bets[requestId];
        require(bet.player != address(0), "Bet not found");
        require(!bet.resolved, "Bet already resolved");
        
        uint256 randomness = randomWords[0];
        bet.result = randomness;
        bet.resolved = true;

        uint256 winAmount = 0;
        if (bet.gameType == 0) { // Dice (1-6)
            uint256 diceResult = (randomness % 6) + 1;
            if (diceResult > 3) { // Simplified 50/50 win
                winAmount = bet.amount * 2;
            }
        } else if (bet.gameType == 1) { // CoinFlip
            uint256 flipResult = randomness % 2;
            if (flipResult == 1) {
                winAmount = bet.amount * 2;
            }
        } else if (bet.gameType == 2) { // Roulette (simplified)
            uint256 rouletteResult = randomness % 37;
            if (rouletteResult != 0) { // Simplified: win on any non-zero
                 winAmount = (bet.amount * 36) / 18; // 2x payout for simplification
            }
        }

        if (winAmount > 0) {
            uint256 fee = (winAmount * houseEdgeBps) / 10000;
            uint256 payout = winAmount - fee;
            
            bet.winAmount = payout;
            
            // Send fee to RoyaltyDistributor
            mtwToken.approve(address(royaltyDistributor), fee);
            royaltyDistributor.depositRoyalty(bet.tokenId, fee);
            
            require(mtwToken.transfer(bet.player, payout), "Payout failed");
        }

        emit BetResolved(requestId, randomness, winAmount);
    }

    /**
     * @dev Update Chainlink VRF configurations.
     */
    function updateConfig(
        uint256 _subscriptionId,
        bytes32 _keyHash,
        uint32 _callbackGasLimit
    ) external onlyOwner {
        s_subscriptionId = _subscriptionId;
        keyHash = _keyHash;
        callbackGasLimit = _callbackGasLimit;
    }
}
