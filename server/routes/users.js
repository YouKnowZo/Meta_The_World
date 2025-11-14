import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('ownedProperties');
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('ownedProperties');
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
});

router.put('/me/avatar', authenticate, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { avatar: req.body },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/me/profession', authenticate, async (req, res) => {
  try {
    const { profession } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { profession },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/me/become-agent', authenticate, async (req, res) => {
  try {
    const { license, commissionRate } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { 
        isRealEstateAgent: true,
        agentLicense: license,
        agentCommissionRate: commissionRate || 0.05,
        profession: 'real-estate-agent'
      },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
