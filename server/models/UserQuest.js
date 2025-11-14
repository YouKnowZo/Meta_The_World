import mongoose from 'mongoose';

const userQuestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quest: { type: mongoose.Schema.Types.ObjectId, ref: 'Quest', required: true },
  progress: [{
    type: { type: String, required: true },
    current: { type: Number, default: 0 },
    required: { type: Number, required: true },
    completed: { type: Boolean, default: false }
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'claimed'],
    default: 'active'
  },
  startedAt: { type: Date, default: Date.now },
  completedAt: Date,
  claimedAt: Date
});

userQuestSchema.index({ user: 1, quest: 1 }, { unique: true });
userQuestSchema.index({ user: 1, status: 1 });

export default mongoose.model('UserQuest', userQuestSchema);
