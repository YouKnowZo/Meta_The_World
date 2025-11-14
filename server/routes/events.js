import express from 'express';
import Event from '../models/Event.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Create event
router.post('/', authenticate, async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      host: req.userId,
      attendees: [req.userId]
    });

    await event.save();
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get events
router.get('/', async (req, res) => {
  try {
    const { upcoming = true, cityId } = req.query;
    
    const query = { isPublic: true };
    if (upcoming === 'true') {
      query.startTime = { $gte: new Date() };
    }
    if (cityId) {
      query['location.city'] = cityId;
    }

    const events = await Event.find(query)
      .populate('host', 'username avatar')
      .populate('attendees', 'username avatar')
      .sort({ startTime: 1 })
      .limit(50);

    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// RSVP to event
router.post('/:eventId/rsvp', authenticate, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.attendees.includes(req.userId)) {
      return res.status(400).json({ error: 'Already RSVPed' });
    }

    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({ error: 'Event is full' });
    }

    if (event.requiresTicket && event.ticketPrice > 0) {
      const user = await User.findById(req.userId);
      if (user.balance < event.ticketPrice) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }
      user.balance -= event.ticketPrice;
      await user.save();
    }

    event.attendees.push(req.userId);
    await event.save();

    res.json({ success: true, event });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
