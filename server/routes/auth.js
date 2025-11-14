const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAgent: user.isAgent,
        virtualCurrency: user.virtualCurrency
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAgent: user.isAgent,
        virtualCurrency: user.virtualCurrency,
        totalEarnings: user.totalEarnings
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Become an agent
router.post('/become-agent', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isAgent) {
      return res.status(400).json({ error: 'User is already an agent' });
    }

    user.isAgent = true;
    user.agentLicense = `AG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    user.agentCommissionRate = req.body.commissionRate || 0.05;
    await user.save();

    res.json({
      message: 'Successfully became an agent',
      agentLicense: user.agentLicense,
      commissionRate: user.agentCommissionRate
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
