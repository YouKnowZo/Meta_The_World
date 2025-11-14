const express = require('express');
const { getDb } = require('../database');
const { authenticateToken } = require('./auth');

const router = express.Router();

// Get user profile
router.get('/me', authenticateToken, (req, res) => {
  const db = getDb();
  db.get(
    `SELECT id, username, email, role, wallet_balance, avatar_data, created_at
     FROM users WHERE id = ?`,
    [req.user.userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch user' });
      }
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    }
  );
});

// Update user profile
router.put('/me', authenticateToken, (req, res) => {
  const db = getDb();
  const { username, avatar_data } = req.body;
  const updates = [];
  const params = [];

  if (username) {
    updates.push('username = ?');
    params.push(username);
  }
  if (avatar_data !== undefined) {
    updates.push('avatar_data = ?');
    params.push(JSON.stringify(avatar_data));
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No updates provided' });
  }

  params.push(req.user.userId);

  db.run(
    `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
    params,
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update profile' });
      }
      res.json({ message: 'Profile updated successfully' });
    }
  );
});

// Add funds to wallet
router.post('/wallet/add', authenticateToken, (req, res) => {
  const db = getDb();
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  db.run(
    `UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?`,
    [amount, req.user.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to add funds' });
      }
      res.json({ message: 'Funds added successfully', amount });
    }
  );
});

module.exports = router;
