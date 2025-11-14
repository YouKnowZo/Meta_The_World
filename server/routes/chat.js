import express from 'express';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Send message
router.post('/send', authenticate, async (req, res) => {
  try {
    const { receiverId, chatType, content, groupId, position } = req.body;
    
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Message content required' });
    }

    const message = new Message({
      sender: req.userId,
      receiver: receiverId || null,
      chatType: chatType || 'global',
      group: groupId || null,
      content: content.trim(),
      position: position || null
    });

    await message.save();
    
    // Populate sender info
    await message.populate('sender', 'username avatar');

    // Emit via Socket.io (handled in server/index.js)
    res.json({ success: true, message });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get messages
router.get('/messages', authenticate, async (req, res) => {
  try {
    const { chatType, receiverId, groupId, limit = 50 } = req.query;
    
    const query = {};
    
    if (chatType === 'private' && receiverId) {
      query.$or = [
        { sender: req.userId, receiver: receiverId },
        { sender: receiverId, receiver: req.userId }
      ];
    } else if (chatType === 'group' && groupId) {
      query.chatType = 'group';
      query.group = groupId;
    } else {
      query.chatType = chatType || 'global';
    }

    const messages = await Message.find(query)
      .populate('sender', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark messages as read
router.put('/read', authenticate, async (req, res) => {
  try {
    const { messageIds } = req.body;
    
    await Message.updateMany(
      { _id: { $in: messageIds }, receiver: req.userId },
      { read: true, readAt: new Date() }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
