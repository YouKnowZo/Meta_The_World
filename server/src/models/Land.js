import mongoose from 'mongoose';

const landSchema = new mongoose.Schema({
  tokenId: {
    type: Number,
    required: true,
    unique: true,
  },
  owner: {
    type: String,
    required: true,
    lowercase: true,
  },
  coordinates: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    z: { type: Number, required: true },
  },
  size: {
    type: Number,
    required: true,
  },
  landType: {
    type: String,
    required: true,
    enum: ['grass', 'sand', 'stone', 'forest', 'water', 'mountain'],
  },
  metadata: {
    name: String,
    description: String,
    image: String,
    attributes: mongoose.Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
landSchema.index({ owner: 1 });
landSchema.index({ landType: 1 });
landSchema.index({ 'coordinates.x': 1, 'coordinates.y': 1, 'coordinates.z': 1 });

const Land = mongoose.model('Land', landSchema);

export default Land;
