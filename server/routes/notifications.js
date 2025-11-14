import express from 'express';
import Notification from '../models/Notification.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get notifications
router.get('/', authenticate, async (req, res) => {
  try {
    const { limit = 50, unreadOnly = false } = req.query;
    
    const query = { user: req.userId };
    if (unreadOnly === 'true') {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark as read
router.put('/read', authenticate, async (req, res) => {
  try {
    const { notificationIds } = req.body;
    
    await Notification.updateMany(
      { _id: { $in: notificationIds }, user: req.userId },
      { read: true, readAt: new Date() }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mark all as read
router.put('/read-all', authenticate, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.userId, read: false },
      { read: true, readAt: new Date() }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get unread count
router.get('/unread-count', authenticate, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.userId,
      read: false
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete notification
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await notification.deleteOne();
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
