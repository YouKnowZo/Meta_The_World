import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: [
      'friend_request',
      'friend_accepted',
      'property_sold',
      'property_purchased',
      'match',
      'message',
      'quest_complete',
      'achievement',
      'level_up',
      'transaction',
      'event',
      'group_invite'
    ],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: mongoose.Schema.Types.Mixed, // Additional data (user ID, property ID, etc.)
  read: { type: Boolean, default: false },
  readAt: Date,
  createdAt: { type: Date, default: Date.now }
});

notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, read: 1 });

export default mongoose.model('Notification', notificationSchema);
