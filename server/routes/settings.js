import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get settings
router.get('/', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json(user.settings || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update settings
router.put('/', authenticate, async (req, res) => {
  try {
    const updates = req.body;
    
    const user = await User.findById(req.userId);
    user.settings = { ...user.settings, ...updates };
    await user.save();

    res.json(user.settings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mark tutorial as completed
router.post('/tutorial-complete', authenticate, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, {
      tutorialCompleted: true
    });

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
