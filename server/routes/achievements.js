import express from 'express';
import Achievement from '../models/Achievement.js';
import UserAchievement from '../models/UserAchievement.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all achievements
router.get('/', async (req, res) => {
  try {
    const achievements = await Achievement.find({ isActive: true });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user achievements
router.get('/my-achievements', authenticate, async (req, res) => {
  try {
    const userAchievements = await UserAchievement.find({ user: req.userId })
      .populate('achievement')
      .sort({ unlockedAt: -1 });

    res.json(userAchievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check and unlock achievement
router.post('/check', authenticate, async (req, res) => {
  try {
    const { achievementId } = req.body;
    
    const achievement = await Achievement.findById(achievementId);
    if (!achievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    // Check if already unlocked
    const existing = await UserAchievement.findOne({
      user: req.userId,
      achievement: achievementId
    });

    if (existing) {
      return res.json({ alreadyUnlocked: true });
    }

    // Check requirements (simplified - you'd implement actual checking logic)
    const user = await User.findById(req.userId).populate('ownedProperties ownedCars ownedPets');
    
    let unlocked = false;
    // Example checks based on achievement requirements
    if (achievement.requirements.type === 'property_count') {
      unlocked = user.ownedProperties.length >= achievement.requirements.value;
    } else if (achievement.requirements.type === 'balance') {
      unlocked = user.balance >= achievement.requirements.value;
    } else if (achievement.requirements.type === 'level') {
      unlocked = user.stats.level >= achievement.requirements.value;
    }
    // Add more checks as needed

    if (unlocked) {
      const userAchievement = new UserAchievement({
        user: req.userId,
        achievement: achievementId
      });
      await userAchievement.save();

      // Award rewards
      if (achievement.rewards.currency) {
        user.balance += achievement.rewards.currency;
      }
      if (achievement.rewards.experience) {
        user.stats.experience += achievement.rewards.experience;
      }
      await user.save();

      await Notification.create({
        user: req.userId,
        type: 'achievement',
        title: 'Achievement Unlocked!',
        message: `You unlocked: ${achievement.name}`,
        data: { achievementId: achievementId }
      });

      await userAchievement.populate('achievement');
      res.json({ unlocked: true, achievement: userAchievement });
    } else {
      res.json({ unlocked: false });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
