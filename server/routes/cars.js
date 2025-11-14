import express from 'express';
import Car from '../models/Car.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

const CAR_MODELS = [
  { brand: 'Meta', model: 'Speedster', basePrice: 50000 },
  { brand: 'Meta', model: 'Luxury', basePrice: 150000 },
  { brand: 'Meta', model: 'Sport', basePrice: 80000 },
  { brand: 'Meta', model: 'Classic', basePrice: 40000 },
  { brand: 'Meta', model: 'Super', basePrice: 500000 },
  { brand: 'Meta', model: 'Eco', basePrice: 30000 }
];

router.get('/models', (req, res) => {
  res.json(CAR_MODELS);
});

router.get('/my-cars', authenticate, async (req, res) => {
  try {
    const cars = await Car.find({ owner: req.userId });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/purchase', authenticate, async (req, res) => {
  try {
    const { modelIndex, customizations } = req.body;
    const carModel = CAR_MODELS[modelIndex];
    
    if (!carModel) {
      return res.status(400).json({ error: 'Invalid car model' });
    }

    const user = await User.findById(req.userId);
    const totalPrice = carModel.basePrice + (customizations?.upgradeCost || 0);

    if (user.balance < totalPrice) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const car = new Car({
      owner: req.userId,
      brand: carModel.brand,
      model: carModel.model,
      basePrice: carModel.basePrice,
      customization: customizations || {},
      position: user.position
    });

    user.balance -= totalPrice;
    user.ownedCars.push(car._id);

    await Promise.all([car.save(), user.save()]);

    res.json({ car, newBalance: user.balance });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id/customize', authenticate, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car || car.owner.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Not your car' });
    }

    const { customization, cost } = req.body;
    const user = await User.findById(req.userId);

    if (cost && user.balance < cost) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    if (cost) {
      user.balance -= cost;
      await user.save();
    }

    car.customization = { ...car.customization, ...customization };
    await car.save();

    res.json({ car, newBalance: user.balance });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id/position', authenticate, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car || car.owner.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Not your car' });
    }

    car.position = req.body.position;
    car.isParked = req.body.isParked || false;
    await car.save();

    res.json(car);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
