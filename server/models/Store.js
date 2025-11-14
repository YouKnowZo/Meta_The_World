import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  storeType: { 
    type: String, 
    enum: ['food', 'clothing', 'pet', 'car-dealership', 'restaurant', 'gas-station', 'electronics', 'furniture'],
    required: true
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
  coordinates: {
    x: { type: Number, required: true },
    z: { type: Number, required: true }
  },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  description: String,
  rating: { type: Number, default: 5, min: 0, max: 5 },
  isOpen: { type: Boolean, default: true },
  hours: {
    open: { type: String, default: '09:00' },
    close: { type: String, default: '21:00' }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Store', storeSchema);
