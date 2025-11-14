import express from 'express';
import FriendRequest from '../models/FriendRequest.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Send friend request
router.post('/request', authenticate, async (req, res) => {
  try {
    const { userId } = req.body;

    if (userId === req.userId.toString()) {
      return res.status(400).json({ error: 'Cannot friend yourself' });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already friends
    const currentUser = await User.findById(req.userId);
    if (currentUser.social.friends.includes(userId)) {
      return res.status(400).json({ error: 'Already friends' });
    }

    // Check if request already exists
    let request = await FriendRequest.findOne({
      $or: [
        { from: req.userId, to: userId },
        { from: userId, to: req.userId }
      ]
    });

    if (request) {
      if (request.status === 'pending') {
        return res.status(400).json({ error: 'Friend request already pending' });
      }
      if (request.status === 'accepted') {
        return res.status(400).json({ error: 'Already friends' });
      }
    }

    request = new FriendRequest({
      from: req.userId,
      to: userId
    });

    await request.save();

    // Create notification
    await Notification.create({
      user: userId,
      type: 'friend_request',
      title: 'New Friend Request',
      message: `${currentUser.username} sent you a friend request`,
      data: { fromUserId: req.userId, requestId: request._id }
    });

    res.json({ success: true, request });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Accept friend request
router.post('/accept', authenticate, async (req, res) => {
  try {
    const { requestId } = req.body;

    const request = await FriendRequest.findById(requestId);
    if (!request || request.to.toString() !== req.userId.toString()) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Request already processed' });
    }

    request.status = 'accepted';
    request.respondedAt = new Date();
    await request.save();

    // Add to friends list
    await User.findByIdAndUpdate(req.userId, {
      $addToSet: { 'social.friends': request.from }
    });

    await User.findByIdAndUpdate(request.from, {
      $addToSet: { 'social.friends': req.userId }
    });

    // Create notifications
    const fromUser = await User.findById(request.from);
    await Notification.create({
      user: request.from,
      type: 'friend_accepted',
      title: 'Friend Request Accepted',
      message: `${(await User.findById(req.userId)).username} accepted your friend request`,
      data: { userId: req.userId }
    });

    res.json({ success: true, friend: fromUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Reject friend request
router.post('/reject', authenticate, async (req, res) => {
  try {
    const { requestId } = req.body;

    const request = await FriendRequest.findById(requestId);
    if (!request || request.to.toString() !== req.userId.toString()) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    request.status = 'rejected';
    request.respondedAt = new Date();
    await request.save();

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get friend requests
router.get('/requests', authenticate, async (req, res) => {
  try {
    const requests = await FriendRequest.find({
      to: req.userId,
      status: 'pending'
    })
      .populate('from', 'username avatar isOnline lastSeen')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get friends list
router.get('/list', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('social.friends', 'username avatar isOnline lastSeen profession');
    res.json(user.social.friends || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove friend
router.delete('/remove', authenticate, async (req, res) => {
  try {
    const { userId } = req.body;

    await User.findByIdAndUpdate(req.userId, {
      $pull: { 'social.friends': userId }
    });

    await User.findByIdAndUpdate(userId, {
      $pull: { 'social.friends': req.userId }
    });

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
