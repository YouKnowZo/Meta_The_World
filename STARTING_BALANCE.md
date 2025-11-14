# Starting Balance Guide 💰

## How New Users Get Started

### 1. Automatic Virtual Currency (No Setup Needed)
When you register a new account, you **automatically receive**:
- ✅ **10,000 virtual currency** 
- ✅ Instant access - no wallet needed
- ✅ Use immediately for:
  - Buying food at stores
  - Purchasing clothes
  - Adopting pets
  - Buying cars
  - Real estate transactions

### 2. Cryptocurrency Faucet (Optional)
For real blockchain cryptocurrency:

1. **Install MetaMask**
   - Download from [metamask.io](https://metamask.io)
   - Create or import a wallet
   - Switch to Polygon network (recommended for lower fees)

2. **Connect Wallet**
   - Click the wallet icon in the bottom-right corner
   - Click "Connect MetaMask"
   - Approve the connection

3. **Claim Faucet**
   - Click "Claim Faucet" button
   - Receive:
     - **10 MATIC** (Polygon) OR **0.01 ETH** (Ethereum)
     - **+5,000 bonus virtual currency**
   - One claim per wallet address

## Supported Networks

### Polygon (Recommended) ⭐
- **Starting Balance**: 10 MATIC
- **Why?** Lower gas fees, faster transactions
- **Chain ID**: 137
- **Best for**: Most users

### Ethereum Mainnet
- **Starting Balance**: 0.01 ETH
- **Why?** Most established network
- **Chain ID**: 1
- **Best for**: Users who prefer Ethereum

### Also Available:
- Binance Smart Chain (BSC)
- Arbitrum
- Optimism

## Balance Types Explained

### Virtual Currency (In-Game)
- **Amount**: 10,000 on registration
- **Stored**: Database (fast, no blockchain)
- **Use**: All in-game purchases
- **Earn**: Through gameplay, sales, commissions
- **No fees**: Instant transactions

### Cryptocurrency (Blockchain)
- **Amount**: 10 MATIC or 0.01 ETH via faucet
- **Stored**: Your wallet (you own it)
- **Use**: Real ownership, NFT properties (future)
- **Earn**: Through real transactions
- **Fees**: Small gas fees on transactions

## Earning More Balance

### Virtual Currency
- ✅ Complete daily quests
- ✅ Sell properties
- ✅ Earn commissions as real estate agent
- ✅ Trade items
- ✅ Level up (future)

### Cryptocurrency
- ✅ Connect wallet and claim faucet
- ✅ Purchase with real money (future)
- ✅ Earn through NFT sales (future)
- ✅ Staking rewards (future)

## FAQ

**Q: Do I need crypto to play?**
A: No! You get 10,000 virtual currency automatically. Crypto is optional.

**Q: How much do I start with?**
A: 10,000 virtual currency automatically + 10 MATIC (or 0.01 ETH) if you claim the faucet.

**Q: Is the faucet really free?**
A: Yes! One-time claim per wallet address. No credit card needed.

**Q: Which network should I use?**
A: Polygon is recommended (lower fees), but Ethereum also works.

**Q: Can I use both currencies?**
A: Yes! Virtual currency for quick purchases, crypto for real ownership.

**Q: What if I don't have MetaMask?**
A: No problem! You can play fully with just virtual currency.

## For Developers

### Changing Starting Balance

Edit `server/routes/auth.js`:
```javascript
const startingBalance = 10000; // Change this value
```

Edit `server/models/User.js`:
```javascript
balance: { type: Number, default: 10000 }, // Change default
```

### Changing Faucet Amount

Edit `server/routes/crypto.js`:
```javascript
faucetAmount: ethers.parseEther('10').toString(), // Change amount
```

### Disabling Faucet

Set in `.env`:
```env
FAUCET_ENABLED=false
```
