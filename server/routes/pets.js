import express from 'express';
import Pet from '../models/Pet.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/my-pets', authenticate, async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.userId });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/adopt', authenticate, async (req, res) => {
  try {
    const { name, type, breed, color, cost } = req.body;
    const user = await User.findById(req.userId);

    if (user.balance < cost) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const pet = new Pet({
      owner: req.userId,
      name,
      type,
      breed,
      color,
      position: user.position
    });

    user.balance -= cost;
    user.ownedPets.push(pet._id);

    await Promise.all([pet.save(), user.save()]);

    res.json({ pet, newBalance: user.balance });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id/feed', authenticate, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet || pet.owner.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Not your pet' });
    }

    pet.hunger = Math.min(100, pet.hunger + 20);
    pet.happiness = Math.min(100, pet.happiness + 5);
    await pet.save();

    res.json(pet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id/play', authenticate, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet || pet.owner.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Not your pet' });
    }

    pet.happiness = Math.min(100, pet.happiness + 15);
    pet.energy = Math.max(0, pet.energy - 10);
    await pet.save();

    res.json(pet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id/position', authenticate, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet || pet.owner.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Not your pet' });
    }

    pet.position = req.body.position;
    pet.isFollowing = req.body.isFollowing !== undefined ? req.body.isFollowing : pet.isFollowing;
    await pet.save();

    res.json(pet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
