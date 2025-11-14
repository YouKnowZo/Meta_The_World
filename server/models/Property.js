const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['land', 'residential', 'commercial', 'luxury', 'estate'],
    required: true
  },
  location: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    z: { type: Number, required: true },
    region: { type: String, required: true }
  },
  size: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    depth: { type: Number, required: true }
  },
  price: {
    type: Number,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  listed: {
    type: Boolean,
    default: false
  },
  listingAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  commissionRate: {
    type: Number,
    default: 0.05 // 5% default commission
  },
  features: [{
    name: String,
    value: String
  }],
  images: [String],
  model3D: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  soldAt: {
    type: Date,
    default: null
  },
  viewCount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Property', propertySchema);
