import mongoose from 'mongoose';

const datingProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: String,
  age: { type: Number, min: 18 },
  interests: [String],
  lookingFor: { 
    type: String, 
    enum: ['friendship', 'dating', 'serious-relationship', 'casual'],
    default: 'friendship'
  },
  photos: [String],
  preferences: {
    ageRange: {
      min: { type: Number, default: 18 },
      max: { type: Number, default: 100 }
    },
    interests: [String]
  },
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isActive: { type: Boolean, default: true },
  lastActive: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('DatingProfile', datingProfileSchema);
