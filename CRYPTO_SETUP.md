# Cryptocurrency Integration Guide 🪙

## Supported Blockchains

Meta The World supports multiple blockchains for maximum flexibility:

### Primary: **Polygon** (Recommended)
- **Why Polygon?** Lower gas fees, faster transactions, Ethereum-compatible
- **Starting Balance**: 10 MATIC via faucet
- **Chain ID**: 137
- **RPC**: `https://polygon-rpc.com` (or use your own)

### Secondary: **Ethereum Mainnet**
- **Starting Balance**: 0.01 ETH via faucet
- **Chain ID**: 1
- **RPC**: `https://eth.llamarpc.com` (or use your own)

### Also Supported:
- **Binance Smart Chain (BSC)**
- **Arbitrum**
- **Optimism**

## Automatic Starting Balance (Faucet System)

### How It Works

1. **Virtual Currency** (Always Available)
   - New users automatically receive **10,000 virtual currency** on registration
   - Used for in-game transactions (food, clothes, pets, etc.)
   - Stored in database, no blockchain needed

2. **Cryptocurrency** (Via Faucet)
   - Connect your MetaMask wallet
   - Click "Claim Faucet" button
   - Receive free crypto:
     - **Polygon**: 10 MATIC
     - **Ethereum**: 0.01 ETH
   - Plus bonus 5,000 virtual currency!

### Faucet Rules
- ✅ One claim per wallet address
- ✅ Must connect wallet first
- ✅ Automatic bonus virtual currency
- ✅ Works on testnet or mainnet

## Setup Instructions

### 1. Environment Variables

Add to your `.env` file:

```env
# Polygon RPC (use your own for production)
POLYGON_RPC=https://polygon-rpc.com
MTW_TOKEN_ADDRESS_POLYGON=0x... # Your token contract address

# Ethereum RPC (optional)
ETHEREUM_RPC=https://eth.llamarpc.com
MTW_TOKEN_ADDRESS_ETHEREUM=0x... # Your token contract address

# Faucet Settings
FAUCET_ENABLED=true
FAUCET_AMOUNT_POLYGON=10000000000000000000 # 10 MATIC in wei
FAUCET_AMOUNT_ETHEREUM=10000000000000000   # 0.01 ETH in wei
```

### 2. Install MetaMask (Users)

Users need to:
1. Install [MetaMask](https://metamask.io/) browser extension
2. Create or import a wallet
3. Switch to Polygon network (or Ethereum)
4. Click "Connect Wallet" in the game
5. Click "Claim Faucet" to get starting balance

### 3. For Production: Fund Faucet Wallet

For real cryptocurrency distribution, you'll need:

1. **Create a Faucet Wallet**
   ```bash
   # Generate a new wallet (keep private key secure!)
   node -e "const { ethers } = require('ethers'); const w = ethers.Wallet.createRandom(); console.log('Address:', w.address); console.log('Private Key:', w.privateKey);"
   ```

2. **Fund the Faucet Wallet**
   - Send MATIC/ETH to the faucet wallet address
   - Amount depends on expected users:
     - 100 users × 10 MATIC = 1,000 MATIC needed
     - 100 users × 0.01 ETH = 1 ETH needed

3. **Configure Automated Distribution** (Optional)
   - Use smart contract for automated faucet
   - Or implement rate limiting per IP address
   - Monitor faucet balance

## Token Integration (Future)

### Creating Your Own Token

You can create a custom token for Meta The World:

1. **Deploy ERC-20 Token**
   - Name: "Meta The World Token"
   - Symbol: "MTW"
   - Supply: Your choice

2. **Update Configuration**
   ```env
   MTW_TOKEN_ADDRESS_POLYGON=0xYourTokenAddress
   ```

3. **Token Uses**
   - Property purchases
   - Premium features
   - Governance (future)
   - Staking rewards (future)

## Current Implementation

### Virtual Currency (Default)
- ✅ Automatic on registration: **10,000 coins**
- ✅ Used for: Food, clothes, pets, cars, properties
- ✅ No blockchain needed
- ✅ Instant transactions

### Cryptocurrency (Optional)
- ✅ Connect MetaMask wallet
- ✅ Claim faucet for free crypto
- ✅ Real blockchain transactions
- ✅ NFT property ownership (future)

## API Endpoints

### Crypto Routes
- `POST /api/crypto/connect` - Connect wallet
- `GET /api/crypto/wallet` - Get wallet info
- `POST /api/crypto/faucet/claim` - Claim starting balance
- `GET /api/crypto/networks` - Get supported networks

## Security Notes

⚠️ **Important for Production:**

1. **Never expose private keys** in code
2. **Use environment variables** for RPC URLs
3. **Implement rate limiting** on faucet
4. **Monitor faucet balance** to prevent abuse
5. **Use testnet** for development
6. **Verify wallet signatures** for critical operations

## Testing

### Testnet Setup

For testing, use Polygon Mumbai testnet:

```env
POLYGON_RPC=https://rpc-mumbai.maticvigil.com
```

Get free testnet MATIC from:
- [Polygon Faucet](https://faucet.polygon.technology/)
- [Alchemy Faucet](https://www.alchemy.com/faucets/polygon-mumbai)

## FAQ

**Q: Do I need crypto to play?**
A: No! Virtual currency is automatic. Crypto is optional for real ownership.

**Q: How much do I get?**
A: 10,000 virtual currency automatically + 10 MATIC (or 0.01 ETH) via faucet.

**Q: Can I use real money?**
A: Yes, connect your wallet and claim the faucet for real crypto.

**Q: Which network should I use?**
A: Polygon recommended (lower fees), but Ethereum also supported.

**Q: Is the faucet free?**
A: Yes! One-time claim per wallet address.
