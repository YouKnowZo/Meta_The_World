import express from 'express';
import Property from '../models/Property.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const properties = await Property.find().populate('owner');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner');
    res.json(property);
  } catch (error) {
    res.status(404).json({ error: 'Property not found' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const property = new Property({
      ...req.body,
      owner: req.userId
    });
    await property.save();
    
    // Add to user's owned properties
    await User.findByIdAndUpdate(req.userId, {
      $push: { ownedProperties: property._id }
    });
    
    res.json(property);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id/list', async (req, res) => {
  try {
    const { price } = req.body;
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { listed: true, price },
      { new: true }
    );
    res.json(property);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id/unlist', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { listed: false },
      { new: true }
    );
    res.json(property);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
