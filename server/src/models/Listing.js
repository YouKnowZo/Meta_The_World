import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  tokenId: {
    type: Number,
    required: true,
  },
  seller: {
    type: String,
    required: true,
    lowercase: true,
  },
  price: {
    type: Number,
    required: true,
  },
  landType: {
    type: String,
    required: true,
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
  metadata: {
    name: String,
    description: String,
    image: String,
    attributes: mongoose.Schema.Types.Mixed,
  },
  active: {
    type: Boolean,
    default: true,
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
listingSchema.index({ seller: 1 });
listingSchema.index({ active: 1 });
listingSchema.index({ price: 1 });
listingSchema.index({ tokenId: 1, active: 1 });

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
