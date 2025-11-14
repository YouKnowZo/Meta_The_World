import mongoose from 'mongoose';

const citySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  coordinates: {
    centerX: { type: Number, required: true },
    centerZ: { type: Number, required: true },
    radius: { type: Number, default: 500 }
  },
  necessities: {
    foodStores: { type: Number, default: 3, min: 1 },
    clothingStores: { type: Number, default: 2, min: 1 },
    petStores: { type: Number, default: 1, min: 0 },
    carDealerships: { type: Number, default: 1, min: 0 },
    restaurants: { type: Number, default: 5, min: 1 },
    gasStations: { type: Number, default: 2, min: 1 },
    hospitals: { type: Number, default: 1, min: 0 },
    schools: { type: Number, default: 2, min: 0 }
  },
  population: { type: Number, default: 0 },
  description: String,
  theme: { type: String, enum: ['modern', 'historic', 'futuristic', 'tropical', 'urban'], default: 'modern' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('City', citySchema);
