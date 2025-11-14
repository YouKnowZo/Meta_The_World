import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get leaderboard
router.get('/', async (req, res) => {
  try {
    const { type = 'wealth', limit = 100 } = req.query;
    
    let sortQuery = {};
    if (type === 'wealth') {
      sortQuery = { balance: -1 };
    } else if (type === 'level') {
      sortQuery = { 'stats.level': -1, 'stats.experience': -1 };
    } else if (type === 'properties') {
      // Sort by ownedProperties array length
      const users = await User.find().populate('ownedProperties');
      const sorted = users.sort((a, b) => 
        (b.ownedProperties?.length || 0) - (a.ownedProperties?.length || 0)
      );
      return res.json(sorted.slice(0, parseInt(limit)).map(u => ({
        username: u.username,
        avatar: u.avatar,
        value: u.ownedProperties?.length || 0
      })));
    }

    const users = await User.find()
      .select('username avatar balance stats')
      .sort(sortQuery)
      .limit(parseInt(limit))
      .lean();

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      avatar: user.avatar,
      value: type === 'wealth' ? user.balance : user.stats?.level || 1
    }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
