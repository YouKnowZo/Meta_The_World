import mongoose from 'mongoose';

const marketplaceListingSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  item: {
    type: { type: String, enum: ['product', 'car', 'pet', 'property'], required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
    pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet' },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' }
  },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  description: String,
  images: [String],
  status: {
    type: String,
    enum: ['active', 'sold', 'cancelled', 'expired'],
    default: 'active'
  },
  views: { type: Number, default: 0 },
  watchers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  soldAt: Date,
  expiresAt: Date
});

marketplaceListingSchema.index({ seller: 1, status: 1 });
marketplaceListingSchema.index({ 'item.type': 1, status: 1, createdAt: -1 });

export default mongoose.model('MarketplaceListing', marketplaceListingSchema);
