import express from 'express';
import Transaction from '../models/Transaction.js';
import Property from '../models/Property.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/purchase', authenticate, async (req, res) => {
  try {
    const { propertyId, sellerId, agentId, price } = req.body;
    const buyerId = req.userId;
    
    const property = await Property.findById(propertyId);
    const buyer = await User.findById(buyerId);
    const seller = await User.findById(sellerId);
    
    if (!property || !buyer || !seller) {
      return res.status(404).json({ error: 'Property, buyer, or seller not found' });
    }
    
    if (buyer.balance < price) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    
    let agentCommission = 0;
    let agent = null;
    
    if (agentId) {
      agent = await User.findById(agentId);
      if (agent && agent.isRealEstateAgent) {
        agentCommission = price * agent.agentCommissionRate;
        agent.balance += agentCommission;
        await agent.save();
      }
    }
    
    // Transfer funds
    buyer.balance -= price;
    seller.balance += (price - agentCommission);
    
    // Transfer property
    property.owner = buyerId;
    property.listed = false;
    property.transactionHistory.push({
      from: sellerId,
      to: buyerId,
      price,
      agent: agentId,
      agentCommission,
      timestamp: new Date()
    });
    
    // Update ownership arrays
    seller.ownedProperties = seller.ownedProperties.filter(
      p => p.toString() !== propertyId
    );
    buyer.ownedProperties.push(propertyId);
    
    // Create transaction record
    const transaction = new Transaction({
      property: propertyId,
      buyer: buyerId,
      seller: sellerId,
      agent: agentId,
      price,
      agentCommission,
      agentCommissionRate: agent ? agent.agentCommissionRate : 0,
      status: 'completed'
    });
    
    await Promise.all([
      buyer.save(),
      seller.save(),
      property.save(),
      transaction.save()
    ]);
    
    res.json({ transaction, property, buyer, seller, agent });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/agent/:agentId', async (req, res) => {
  try {
    const transactions = await Transaction.find({ agent: req.params.agentId })
      .populate('property')
      .populate('buyer')
      .populate('seller')
      .sort({ timestamp: -1 });
    
    const totalCommission = transactions.reduce((sum, t) => sum + t.agentCommission, 0);
    
    res.json({ transactions, totalCommission });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
