const express = require('express');
const Property = require('../models/Property');
const User = require('../models/User');
const router = express.Router();

// Get all properties
router.get('/', async (req, res) => {
  try {
    const { type, region, listed, minPrice, maxPrice } = req.query;
    const query = {};

    if (type) query.type = type;
    if (region) query['location.region'] = region;
    if (listed !== undefined) query.listed = listed === 'true';
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const properties = await Property.find(query)
      .populate('owner', 'username')
      .populate('listingAgent', 'username')
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
      .populate('listingAgent', 'username');
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Increment view count
    property.viewCount += 1;
    await property.save();

    res.json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create property (admin/owner)
router.post('/', async (req, res) => {
  try {
    const property = new Property(req.body);
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List property for sale
router.post('/:id/list', async (req, res) => {
  try {
    const { agentId, commissionRate } = req.body;
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    property.listed = true;
    if (agentId) {
      property.listingAgent = agentId;
      if (commissionRate) property.commissionRate = commissionRate;
    }

    await property.save();
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Purchase property
router.post('/:id/purchase', async (req, res) => {
  try {
    const { buyerId } = req.body;
    const property = await Property.findById(req.params.id);
    const buyer = await User.findById(buyerId);

    if (!property || !buyer) {
      return res.status(404).json({ error: 'Property or buyer not found' });
    }

    if (!property.listed) {
      return res.status(400).json({ error: 'Property is not listed' });
    }

    if (buyer.wallet.balance < property.price) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    // Transfer ownership
    const seller = property.owner ? await User.findById(property.owner) : null;
    
    buyer.wallet.balance -= property.price;
    if (seller) {
      seller.wallet.balance += property.price;
      seller.stats.propertiesSold += 1;
      await seller.save();
    }

    // Handle agent commission
    if (property.listingAgent) {
      const agent = await User.findById(property.listingAgent);
      if (agent) {
        const commission = property.price * property.commissionRate;
        agent.wallet.balance += commission;
        agent.stats.agentCommission += commission;
        agent.stats.propertiesSold += 1;
        await agent.save();
      }
    }

    property.owner = buyerId;
    property.listed = false;
    property.soldAt = new Date();
    buyer.stats.propertiesOwned += 1;
    buyer.stats.totalEarnings += property.price;

    await property.save();
    await buyer.save();

    res.json({ 
      success: true, 
      property,
      newBalance: buyer.wallet.balance 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
