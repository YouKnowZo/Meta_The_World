const express = require('express');
const Transaction = require('../models/Transaction');
const router = express.Router();

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const { userId, agentId, status } = req.query;
    const query = {};

    if (userId) {
      query.$or = [
        { buyer: userId },
        { seller: userId }
      ];
    }
    if (agentId) query.agent = agentId;
    if (status) query.status = status;

    const transactions = await Transaction.find(query)
      .populate('property', 'name type price location')
      .populate('buyer', 'username')
      .populate('seller', 'username')
      .populate('agent', 'username')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single transaction
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('property')
      .populate('buyer', 'username')
      .populate('seller', 'username')
      .populate('agent', 'username');

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
