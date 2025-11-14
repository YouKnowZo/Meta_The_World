import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // null for global/local chat
  chatType: { 
    type: String, 
    enum: ['global', 'local', 'private', 'group'],
    required: true
  },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' }, // for group chats
  content: { type: String, required: true },
  position: {
    x: Number,
    y: Number,
    z: Number
  },
  read: { type: Boolean, default: false },
  readAt: Date,
  createdAt: { type: Date, default: Date.now }
});

messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, createdAt: -1 });
messageSchema.index({ chatType: 1, createdAt: -1 });

export default mongoose.model('Message', messageSchema);
