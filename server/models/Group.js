import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  type: {
    type: String,
    enum: ['public', 'private', 'invite_only'],
    default: 'public'
  },
  settings: {
    maxMembers: { type: Number, default: 50 },
    allowInvites: { type: Boolean, default: true }
  },
  treasury: { type: Number, default: 0 },
  properties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Group', groupSchema);
