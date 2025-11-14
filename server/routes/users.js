import express from 'express';
import pool from '../database/connection.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, username, email, avatar_url, balance, created_at
       FROM users WHERE id = $1`,
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update avatar
router.put('/avatar', authenticateToken, async (req, res) => {
  try {
    const { avatar_data, clothing, accessories } = req.body;

    await pool.query(
      `UPDATE user_avatars 
       SET avatar_model = $1, clothing = $2, accessories = $3, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $4`,
      [
        JSON.stringify(avatar_data || {}),
        JSON.stringify(clothing || {}),
        JSON.stringify(accessories || {}),
        req.user.userId
      ]
    );

    res.json({ message: 'Avatar updated successfully' });
  } catch (error) {
    console.error('Error updating avatar:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
