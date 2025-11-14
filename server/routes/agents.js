import express from 'express';
import User from '../models/User.js';
import Property from '../models/Property.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const agents = await User.find({ isRealEstateAgent: true });
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/listings', async (req, res) => {
  try {
    const agent = await User.findById(req.params.id);
    if (!agent || !agent.isRealEstateAgent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    const listings = await Property.find({ listed: true }).populate('owner');
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
