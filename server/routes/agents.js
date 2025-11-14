const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Property = require('../models/Property');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.userId = decoded.userId;
    next();
  });
};

// Get all agents
router.get('/', async (req, res) => {
  try {
    const agents = await User.find({ isAgent: true })
      .select('username agentLicense agentCommissionRate totalEarnings');
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get agent stats
router.get('/:id/stats', authenticateToken, async (req, res) => {
  try {
    const agent = await User.findById(req.params.id);
    if (!agent || !agent.isAgent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const listedProperties = await Property.countDocuments({ 
      agent: req.params.id, 
      isListed: true 
    });
    const soldProperties = await Property.countDocuments({ 
      agent: req.params.id, 
      isSold: true 
    });

    res.json({
      agent: {
        username: agent.username,
        agentLicense: agent.agentLicense,
        commissionRate: agent.agentCommissionRate,
        totalEarnings: agent.totalEarnings,
        listedProperties,
        soldProperties
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get agent's listings
router.get('/:id/listings', async (req, res) => {
  try {
    const properties = await Property.find({ 
      agent: req.params.id, 
      isListed: true 
    })
      .populate('owner', 'username')
      .sort({ createdAt: -1 });
    
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
