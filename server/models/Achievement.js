import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  category: {
    type: String,
    enum: ['real_estate', 'social', 'career', 'exploration', 'shopping', 'pets', 'cars', 'general'],
    required: true
  },
  icon: String,
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  requirements: mongoose.Schema.Types.Mixed, // Flexible requirements
  rewards: {
    currency: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    title: String
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Achievement', achievementSchema);
