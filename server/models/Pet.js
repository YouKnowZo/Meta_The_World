import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['dog', 'cat', 'bird', 'fish', 'reptile', 'exotic'],
    required: true
  },
  breed: String,
  color: String,
  age: { type: Number, default: 0 },
  happiness: { type: Number, default: 100, min: 0, max: 100 },
  hunger: { type: Number, default: 50, min: 0, max: 100 },
  energy: { type: Number, default: 100, min: 0, max: 100 },
  accessories: [String],
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    z: { type: Number, default: 0 }
  },
  isFollowing: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Pet', petSchema);
