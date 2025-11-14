import express from 'express';
import DatingProfile from '../models/DatingProfile.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', authenticate, async (req, res) => {
  try {
    let profile = await DatingProfile.findOne({ user: req.userId }).populate('user', 'username avatar');
    if (!profile) {
      profile = new DatingProfile({ user: req.userId });
      await profile.save();
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/profile', authenticate, async (req, res) => {
  try {
    let profile = await DatingProfile.findOne({ user: req.userId });
    if (!profile) {
      profile = new DatingProfile({ user: req.userId, ...req.body });
    } else {
      Object.assign(profile, req.body);
    }
    profile.lastActive = new Date();
    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/discover', authenticate, async (req, res) => {
  try {
    const myProfile = await DatingProfile.findOne({ user: req.userId });
    if (!myProfile || !myProfile.isActive) {
      return res.json([]);
    }

    const excludeIds = [
      req.userId,
      ...myProfile.matches.map(m => m.toString()),
      ...myProfile.likes.map(l => l.toString()),
      ...myProfile.dislikes.map(d => d.toString())
    ];

    const profiles = await DatingProfile.find({
      user: { $nin: excludeIds },
      isActive: true,
      'preferences.ageRange.min': { $lte: myProfile.age || 100 },
      'preferences.ageRange.max': { $gte: myProfile.age || 18 }
    })
      .populate('user', 'username avatar')
      .limit(20);

    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/like/:userId', authenticate, async (req, res) => {
  try {
    const myProfile = await DatingProfile.findOne({ user: req.userId });
    const theirProfile = await DatingProfile.findOne({ user: req.params.userId });

    if (!myProfile || !theirProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    if (myProfile.likes.includes(req.params.userId)) {
      return res.json({ matched: false, message: 'Already liked' });
    }

    myProfile.likes.push(req.params.userId);
    await myProfile.save();

    // Check if it's a match
    const isMatch = theirProfile.likes.includes(req.userId);
    if (isMatch) {
      myProfile.matches.push(req.params.userId);
      theirProfile.matches.push(req.userId);
      await Promise.all([myProfile.save(), theirProfile.save()]);
      
      return res.json({ matched: true, message: 'It\'s a match!' });
    }

    res.json({ matched: false, message: 'Like sent' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/dislike/:userId', authenticate, async (req, res) => {
  try {
    const myProfile = await DatingProfile.findOne({ user: req.userId });
    if (!myProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    if (!myProfile.dislikes.includes(req.params.userId)) {
      myProfile.dislikes.push(req.params.userId);
      await myProfile.save();
    }

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/matches', authenticate, async (req, res) => {
  try {
    const profile = await DatingProfile.findOne({ user: req.userId })
      .populate('matches', 'username avatar');
    res.json(profile?.matches || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
