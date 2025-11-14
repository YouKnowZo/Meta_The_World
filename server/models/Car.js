import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  model: { type: String, required: true },
  brand: { type: String, required: true },
  basePrice: { type: Number, required: true },
  customization: {
    color: { type: String, default: '#000000' },
    wheels: { type: String, default: 'standard' },
    spoiler: { type: Boolean, default: false },
    tint: { type: String, default: 'none' },
    neon: { type: Boolean, default: false },
    neonColor: { type: String, default: '#00ffff' },
    bodyKit: { type: String, default: 'none' },
    engine: { type: String, default: 'standard' },
    interior: { type: String, default: 'standard' },
    licensePlate: String,
    decals: [String]
  },
  stats: {
    speed: { type: Number, default: 100 },
    acceleration: { type: Number, default: 50 },
    handling: { type: Number, default: 50 },
    fuel: { type: Number, default: 100, max: 100 }
  },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    z: { type: Number, default: 0 },
    rotation: { type: Number, default: 0 }
  },
  isParked: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Car', carSchema);
