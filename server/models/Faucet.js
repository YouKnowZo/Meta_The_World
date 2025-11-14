import mongoose from 'mongoose';

const faucetSchema = new mongoose.Schema({
  address: { type: String, required: true, index: true },
  network: { type: String, required: true },
  amount: { type: String, required: true },
  token: { type: String, default: 'native' }, // native, MTW, USDC
  txHash: String,
  claimedAt: { type: Date, default: Date.now },
  ipAddress: String,
  userAgent: String
});

// Index for rate limiting (one claim per address per day)
faucetSchema.index({ address: 1, claimedAt: -1 });

export default mongoose.model('Faucet', faucetSchema);
