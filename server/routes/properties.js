const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const Property = require('../models/Property');
const User = require('../models/User');
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

// Get all properties
router.get('/', async (req, res) => {
  try {
    const { type, district, minPrice, maxPrice, isListed } = req.query;
    const query = {};
    
    if (type) query.type = type;
    if (district) query.location.district = district;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (isListed !== undefined) query.isListed = isListed === 'true';

    const properties = await Property.find(query)
      .populate('owner', 'username')
      .populate('agent', 'username agentLicense')
      .sort({ createdAt: -1 });
    
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'username')
      .populate('agent', 'username agentLicense')
      .populate('listedBy', 'username');
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create property
router.post('/', authenticateToken, async (req, res) => {
  try {
    const propertyData = {
      ...req.body,
      propertyId: uuidv4(),
      owner: req.userId,
      listedBy: req.userId
    };

    const property = new Property(propertyData);
    await property.save();
    
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List property for sale
router.post('/:id/list', authenticateToken, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (property.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    property.isListed = true;
    property.price = req.body.price || property.price;
    if (req.body.agentId) {
      const agent = await User.findById(req.body.agentId);
      if (agent && agent.isAgent) {
        property.agent = req.body.agentId;
      }
    }
    await property.save();

    res.json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update property
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (property.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    Object.assign(property, req.body);
    await property.save();

    res.json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
