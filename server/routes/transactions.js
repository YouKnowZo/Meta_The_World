const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const Transaction = require('../models/Transaction');
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

// Purchase property
router.post('/purchase', authenticateToken, async (req, res) => {
  try {
    const { propertyId } = req.body;
    
    const property = await Property.findById(propertyId)
      .populate('owner')
      .populate('agent');
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (!property.isListed) {
      return res.status(400).json({ error: 'Property is not listed for sale' });
    }

    if (property.owner.toString() === req.userId) {
      return res.status(400).json({ error: 'Cannot purchase your own property' });
    }

    const buyer = await User.findById(req.userId);
    if (buyer.virtualCurrency < property.price) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    // Calculate commission
    let agentCommission = 0;
    let commissionRate = 0;
    if (property.agent && property.agent.isAgent) {
      commissionRate = property.agent.agentCommissionRate;
      agentCommission = property.price * commissionRate;
    }

    // Create transaction
    const transaction = new Transaction({
      transactionId: uuidv4(),
      property: property._id,
      buyer: req.userId,
      seller: property.owner._id,
      agent: property.agent ? property.agent._id : null,
      salePrice: property.price,
      agentCommission,
      commissionRate,
      status: 'completed'
    });

    // Transfer funds
    buyer.virtualCurrency -= property.price;
    const seller = await User.findById(property.owner._id);
    seller.virtualCurrency += (property.price - agentCommission);

    // Pay agent commission
    if (property.agent) {
      const agent = await User.findById(property.agent._id);
      agent.virtualCurrency += agentCommission;
      agent.totalEarnings += agentCommission;
      await agent.save();
    }

    // Update property
    property.owner = req.userId;
    property.isListed = false;
    property.isSold = true;
    property.soldAt = new Date();
    property.agent = null;

    transaction.completedAt = new Date();

    await Promise.all([
      transaction.save(),
      property.save(),
      buyer.save(),
      seller.save()
    ]);

    res.json({
      message: 'Property purchased successfully',
      transaction,
      newBalance: buyer.virtualCurrency
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user transactions
router.get('/my-transactions', authenticateToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [
        { buyer: req.userId },
        { seller: req.userId },
        { agent: req.userId }
      ]
    })
      .populate('property', 'name type location price')
      .populate('buyer', 'username')
      .populate('seller', 'username')
      .populate('agent', 'username agentLicense')
      .sort({ createdAt: -1 });
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
