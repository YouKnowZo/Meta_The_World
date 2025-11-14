import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  tokenId: { type: Number, required: true, unique: true },
  coordinates: {
    x: { type: Number, required: true },
    z: { type: Number, required: true },
    width: { type: Number, default: 10 },
    depth: { type: Number, default: 10 }
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ownerAddress: String, // Blockchain address
  listed: { type: Boolean, default: false },
  price: Number,
  propertyType: { 
    type: String, 
    enum: ['residential', 'commercial', 'land', 'luxury', 'island', 'skybox'],
    default: 'residential'
  },
  building: {
    type: { type: String },
    floors: { type: Number, default: 1 },
    rooms: Number,
    customModel: String, // URL to custom 3D model
    interior: mongoose.Schema.Types.Mixed
  },
  features: [String],
  description: String,
  images: [String],
  transactionHistory: [{
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    price: Number,
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    agentCommission: Number,
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Property', propertySchema);
