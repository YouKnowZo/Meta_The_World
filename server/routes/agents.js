const express = require('express');
const User = require('../models/User');
const Property = require('../models/Property');
const Transaction = require('../models/Transaction');
const router = express.Router();

// Get all agents
router.get('/', async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent' })
      .select('username stats wallet avatar')
      .sort({ 'stats.propertiesSold': -1 });
    
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Become an agent
router.post('/become-agent/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = 'agent';
    await user.save();

    res.json({ 
      success: true, 
      message: 'You are now a real estate agent!',
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get agent's listings
router.get('/:agentId/listings', async (req, res) => {
  try {
    const listings = await Property.find({ 
      listingAgent: req.params.agentId,
      listed: true
    }).populate('owner', 'username');

    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get agent stats
router.get('/:agentId/stats', async (req, res) => {
  try {
    const agent = await User.findById(req.params.agentId);
    if (!agent || agent.role !== 'agent') {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const listings = await Property.countDocuments({ 
      listingAgent: req.params.agentId,
      listed: true
    });

    const transactions = await Transaction.find({ 
      agent: req.params.agentId,
      status: 'completed'
    });

    const totalSales = transactions.reduce((sum, t) => sum + t.price, 0);
    const totalCommission = transactions.reduce((sum, t) => sum + t.commission.amount, 0);

    res.json({
      agent: {
        username: agent.username,
        wallet: agent.wallet
      },
      stats: {
        activeListings: listings,
        totalSales: agent.stats.propertiesSold,
        totalSalesValue: totalSales,
        totalCommission: agent.stats.agentCommission,
        averageCommissionRate: transactions.length > 0 
          ? totalCommission / totalSales 
          : 0
      },
      recentTransactions: transactions.slice(-10)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
