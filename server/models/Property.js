const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  propertyId: {
    type: String,
    required: true,
    unique: true
  },
  nftTokenId: {
    type: String,
    unique: true,
    sparse: true
  },
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
    enum: ['residential', 'commercial', 'land', 'luxury', 'penthouse', 'mansion'],
    required: true
  },
  location: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    z: { type: Number, required: true },
    district: { type: String, required: true }
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  size: {
    type: Number,
    required: true,
    min: 0
  },
  bedrooms: {
    type: Number,
    default: 0
  },
  bathrooms: {
    type: Number,
    default: 0
  },
  features: [{
    type: String
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  listedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  isListed: {
    type: Boolean,
    default: false
  },
  isSold: {
    type: Boolean,
    default: false
  },
  images: [{
    type: String
  }],
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
  }
});

module.exports = mongoose.model('Property', propertySchema);
