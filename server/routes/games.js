import express from 'express';
import GameSession from '../models/GameSession.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Create game session
router.post('/create', authenticate, async (req, res) => {
  try {
    const { gameType, entryFee, settings } = req.body;

    if (entryFee > 0) {
      const user = await User.findById(req.userId);
      if (user.balance < entryFee) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }
      user.balance -= entryFee;
      await user.save();
    }

    const session = new GameSession({
      gameType,
      host: req.userId,
      players: [req.userId],
      entryFee: entryFee || 0,
      prizePool: entryFee || 0,
      settings: settings || {}
    });

    await session.save();
    res.json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Join game
router.post('/:sessionId/join', authenticate, async (req, res) => {
  try {
    const session = await GameSession.findById(req.params.sessionId);
    if (!session || session.status !== 'waiting') {
      return res.status(404).json({ error: 'Game not found or already started' });
    }

    if (session.players.includes(req.userId)) {
      return res.status(400).json({ error: 'Already in game' });
    }

    if (session.entryFee > 0) {
      const user = await User.findById(req.userId);
      if (user.balance < session.entryFee) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }
      user.balance -= session.entryFee;
      session.prizePool += session.entryFee;
      await user.save();
    }

    session.players.push(req.userId);
    await session.save();

    res.json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Submit game results
router.post('/:sessionId/results', authenticate, async (req, res) => {
  try {
    const { score, position } = req.body;
    
    const session = await GameSession.findById(req.params.sessionId);
    if (!session || !session.players.includes(req.userId)) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const existingResult = session.results.find(r => r.user.toString() === req.userId.toString());
    if (existingResult) {
      existingResult.score = score;
      existingResult.position = position;
    } else {
      session.results.push({
        user: req.userId,
        score,
        position
      });
    }

    // Calculate winnings (simplified)
    if (session.status === 'finished') {
      const user = await User.findById(req.userId);
      if (position === 1 && session.prizePool > 0) {
        user.balance += session.prizePool;
        await user.save();
      }
    }

    await session.save();
    res.json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get active games
router.get('/active', async (req, res) => {
  try {
    const { gameType } = req.query;
    
    const query = { status: { $in: ['waiting', 'active'] } };
    if (gameType) {
      query.gameType = gameType;
    }

    const games = await GameSession.find(query)
      .populate('players', 'username avatar')
      .populate('host', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
