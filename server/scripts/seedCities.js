import mongoose from 'mongoose';
import dotenv from 'dotenv';
import City from '../models/City.js';

dotenv.config();

const cities = [
  {
    name: 'Metro Central',
    coordinates: { centerX: 0, centerZ: 0, radius: 300 },
    necessities: {
      foodStores: 5,
      clothingStores: 4,
      petStores: 2,
      carDealerships: 2,
      restaurants: 8,
      gasStations: 3,
      hospitals: 2,
      schools: 3
    },
    theme: 'modern',
    description: 'The bustling heart of the metaverse'
  },
  {
    name: 'Coastal Bay',
    coordinates: { centerX: 500, centerZ: 500, radius: 250 },
    necessities: {
      foodStores: 3,
      clothingStores: 2,
      petStores: 1,
      carDealerships: 1,
      restaurants: 5,
      gasStations: 2,
      hospitals: 1,
      schools: 2
    },
    theme: 'tropical',
    description: 'A relaxing beachside paradise'
  },
  {
    name: 'Tech District',
    coordinates: { centerX: -400, centerZ: -300, radius: 200 },
    necessities: {
      foodStores: 4,
      clothingStores: 3,
      petStores: 1,
      carDealerships: 1,
      restaurants: 6,
      gasStations: 2,
      hospitals: 1,
      schools: 2
    },
    theme: 'futuristic',
    description: 'Where innovation meets the future'
  }
];

async function seedCities() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/meta-the-world');
    console.log('Connected to MongoDB');

    await City.deleteMany({});
    console.log('Cleared existing cities');

    for (const cityData of cities) {
      const city = new City(cityData);
      await city.save();
      console.log(`Created city: ${city.name}`);
    }

    console.log('\n✅ Cities seeded successfully!');
    console.log(`Created ${cities.length} cities with all necessities`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding cities:', error);
    process.exit(1);
  }
}

seedCities();
