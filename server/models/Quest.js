import mongoose from 'mongoose';

const questSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: {
    type: String,
    enum: ['daily', 'weekly', 'story', 'achievement', 'event'],
    required: true
  },
  objectives: [{
    type: { type: String, required: true }, // 'buy_item', 'visit_city', 'make_friend', etc.
    target: { type: String, required: true },
    current: { type: Number, default: 0 },
    required: { type: Number, required: true }
  }],
  rewards: {
    currency: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
  },
  expiresAt: Date, // for daily/weekly quests
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Quest', questSchema);
