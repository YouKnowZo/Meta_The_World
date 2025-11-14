import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['food', 'clothing', 'pet', 'car-part', 'car-accessory', 'furniture', 'electronics', 'consumable'],
    required: true
  },
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  price: { type: Number, required: true, min: 0 },
  description: String,
  image: String,
  stock: { type: Number, default: -1 }, // -1 means unlimited
  attributes: {
    // For food
    hungerRestore: Number,
    energyRestore: Number,
    // For clothing
    style: String,
    rarity: { type: String, enum: ['common', 'rare', 'epic', 'legendary'], default: 'common' },
    // For pets
    petType: String,
    // For car parts
    partType: String,
    performanceBoost: Number
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Product', productSchema);
