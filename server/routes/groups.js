import express from 'express';
import Group from '../models/Group.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Create group
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description, type, maxMembers } = req.body;

    const group = new Group({
      name,
      description,
      owner: req.userId,
      members: [req.userId],
      admins: [req.userId],
      type: type || 'public',
      settings: {
        maxMembers: maxMembers || 50
      }
    });

    await group.save();

    // Add to user's groups
    await User.findByIdAndUpdate(req.userId, {
      $addToSet: { 'social.groups': group._id }
    });

    res.json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get groups
router.get('/', authenticate, async (req, res) => {
  try {
    const { type } = req.query;
    
    const query = {};
    if (type === 'my') {
      const user = await User.findById(req.userId);
      query._id = { $in: user.social.groups || [] };
    } else if (type === 'public') {
      query.type = 'public';
    }

    const groups = await Group.find(query)
      .populate('owner', 'username avatar')
      .populate('members', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Join group
router.post('/:groupId/join', authenticate, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    if (group.members.includes(req.userId)) {
      return res.status(400).json({ error: 'Already a member' });
    }

    if (group.members.length >= group.settings.maxMembers) {
      return res.status(400).json({ error: 'Group is full' });
    }

    group.members.push(req.userId);
    await group.save();

    await User.findByIdAndUpdate(req.userId, {
      $addToSet: { 'social.groups': group._id }
    });

    res.json({ success: true, group });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Leave group
router.post('/:groupId/leave', authenticate, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    group.members = group.members.filter(m => m.toString() !== req.userId.toString());
    group.admins = group.admins.filter(a => a.toString() !== req.userId.toString());
    
    if (group.members.length === 0) {
      await group.deleteOne();
    } else {
      await group.save();
    }

    await User.findByIdAndUpdate(req.userId, {
      $pull: { 'social.groups': group._id }
    });

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
