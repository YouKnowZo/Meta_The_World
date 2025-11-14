import express from 'express';
import City from '../models/City.js';
import Store from '../models/Store.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const cities = await City.find();
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    const stores = await Store.find({ city: req.params.id }).populate('products');
    res.json({ ...city.toObject(), stores });
  } catch (error) {
    res.status(404).json({ error: 'City not found' });
  }
});

router.post('/', async (req, res) => {
  try {
    const city = new City(req.body);
    await city.save();
    
    // Create stores based on necessities
    await createCityStores(city);
    
    res.json(city);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

async function createCityStores(city) {
  const storeTypes = [
    { type: 'food', count: city.necessities.foodStores },
    { type: 'clothing', count: city.necessities.clothingStores },
    { type: 'pet', count: city.necessities.petStores },
    { type: 'car-dealership', count: city.necessities.carDealerships },
    { type: 'restaurant', count: city.necessities.restaurants },
    { type: 'gas-station', count: city.necessities.gasStations }
  ];

  for (const storeType of storeTypes) {
    for (let i = 0; i < storeType.count; i++) {
      const angle = (Math.PI * 2 * i) / storeType.count;
      const radius = city.coordinates.radius * 0.7;
      const store = new Store({
        name: `${city.name} ${storeType.type} Store ${i + 1}`,
        storeType: storeType.type,
        city: city._id,
        coordinates: {
          x: city.coordinates.centerX + Math.cos(angle) * radius,
          z: city.coordinates.centerZ + Math.sin(angle) * radius
        }
      });
      await store.save();
    }
  }
}

export default router;
