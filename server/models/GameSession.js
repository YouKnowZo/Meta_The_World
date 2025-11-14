import mongoose from 'mongoose';

const gameSessionSchema = new mongoose.Schema({
  gameType: {
    type: String,
    enum: ['poker', 'blackjack', 'slots', 'racing', 'basketball', 'fishing'],
    required: true
  },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['waiting', 'active', 'finished'],
    default: 'waiting'
  },
  settings: mongoose.Schema.Types.Mixed,
  results: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score: Number,
    winnings: Number,
    position: Number
  }],
  entryFee: { type: Number, default: 0 },
  prizePool: { type: Number, default: 0 },
  startedAt: Date,
  endedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('GameSession', gameSessionSchema);
