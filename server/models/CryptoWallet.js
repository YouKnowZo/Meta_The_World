import mongoose from 'mongoose';

const cryptoWalletSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  address: { type: String, required: true, unique: true },
  network: { 
    type: String, 
    enum: ['ethereum', 'polygon', 'bsc', 'arbitrum', 'optimism'],
    default: 'polygon' // Polygon for lower gas fees
  },
  balances: {
    native: { type: String, default: '0' }, // ETH, MATIC, etc.
    token: { type: String, default: '0' },  // MTW token
    usdc: { type: String, default: '0' }    // USDC stablecoin
  },
  hasClaimedFaucet: { type: Boolean, default: false },
  lastFaucetClaim: Date,
  transactions: [{
    txHash: String,
    type: { type: String, enum: ['deposit', 'withdraw', 'purchase', 'sale', 'faucet'] },
    amount: String,
    token: String,
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('CryptoWallet', cryptoWalletSchema);
