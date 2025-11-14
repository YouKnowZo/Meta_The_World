import express from 'express';
import Quest from '../models/Quest.js';
import UserQuest from '../models/UserQuest.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get available quests
router.get('/available', authenticate, async (req, res) => {
  try {
    const { type } = req.query;
    
    const query = { isActive: true };
    if (type) {
      query.type = type;
    }

    const quests = await Quest.find(query).sort({ createdAt: -1 });
    
    // Get user's active quests
    const userQuests = await UserQuest.find({
      user: req.userId,
      status: { $in: ['active', 'completed'] }
    }).populate('quest');

    const availableQuests = quests.filter(q => {
      return !userQuests.some(uq => uq.quest._id.toString() === q._id.toString());
    });

    res.json({ available: availableQuests, active: userQuests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start quest
router.post('/start/:questId', authenticate, async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.questId);
    if (!quest || !quest.isActive) {
      return res.status(404).json({ error: 'Quest not found' });
    }

    // Check if already started
    let userQuest = await UserQuest.findOne({
      user: req.userId,
      quest: req.params.questId
    });

    if (userQuest) {
      return res.status(400).json({ error: 'Quest already started' });
    }

    userQuest = new UserQuest({
      user: req.userId,
      quest: req.params.questId,
      progress: quest.objectives.map(obj => ({
        type: obj.type,
        target: obj.target,
        current: 0,
        required: obj.required,
        completed: false
      }))
    });

    await userQuest.save();
    await userQuest.populate('quest');

    res.json(userQuest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update quest progress
router.put('/progress/:questId', authenticate, async (req, res) => {
  try {
    const { objectiveType, amount = 1 } = req.body;
    
    const userQuest = await UserQuest.findOne({
      user: req.userId,
      quest: req.params.questId,
      status: 'active'
    }).populate('quest');

    if (!userQuest) {
      return res.status(404).json({ error: 'Quest not found' });
    }

    // Update progress
    const objective = userQuest.progress.find(p => p.type === objectiveType);
    if (objective && !objective.completed) {
      objective.current = Math.min(objective.current + amount, objective.required);
      objective.completed = objective.current >= objective.required;

      // Check if all objectives completed
      const allCompleted = userQuest.progress.every(p => p.completed);
      if (allCompleted) {
        userQuest.status = 'completed';
        userQuest.completedAt = new Date();

        // Award rewards
        const user = await User.findById(req.userId);
        if (userQuest.quest.rewards.currency) {
          user.balance += userQuest.quest.rewards.currency;
        }
        if (userQuest.quest.rewards.experience) {
          user.stats.experience += userQuest.quest.rewards.experience;
          // Level up check
          const expNeeded = user.stats.level * 1000;
          if (user.stats.experience >= expNeeded) {
            user.stats.level += 1;
            user.stats.experience -= expNeeded;
            
            await Notification.create({
              user: req.userId,
              type: 'level_up',
              title: 'Level Up!',
              message: `Congratulations! You reached level ${user.stats.level}`,
              data: { level: user.stats.level }
            });
          }
        }
        await user.save();

        await Notification.create({
          user: req.userId,
          type: 'quest_complete',
          title: 'Quest Completed!',
          message: `You completed: ${userQuest.quest.title}`,
          data: { questId: req.params.questId, rewards: userQuest.quest.rewards }
        });
      }

      await userQuest.save();
    }

    res.json(userQuest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Claim quest rewards
router.post('/claim/:questId', authenticate, async (req, res) => {
  try {
    const userQuest = await UserQuest.findOne({
      user: req.userId,
      quest: req.params.questId,
      status: 'completed'
    }).populate('quest');

    if (!userQuest) {
      return res.status(404).json({ error: 'Quest not found or not completed' });
    }

    userQuest.status = 'claimed';
    userQuest.claimedAt = new Date();
    await userQuest.save();

    res.json({ success: true, quest: userQuest });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
