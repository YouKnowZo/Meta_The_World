const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user avatar
router.put('/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.avatar = { ...user.avatar, ...req.body };
    await user.save();

    res.json({ success: true, avatar: user.avatar });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user position
router.put('/:id/position', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.position = req.body;
    await user.save();

    res.json({ success: true, position: user.position });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
