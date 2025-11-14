import express from 'express';
import pool from '../database/connection.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Become a real estate agent
router.post('/register', authenticateToken, async (req, res) => {
  try {
    const { license_number } = req.body;

    // Check if already an agent
    const existing = await pool.query(
      `SELECT id FROM user_professions 
       WHERE user_id = $1 AND profession_type = 'real_estate_agent'`,
      [req.user.userId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'You are already registered as an agent' });
    }

    // Create agent profile
    const result = await pool.query(
      `INSERT INTO user_professions 
       (user_id, profession_type, license_number, verified)
       VALUES ($1, 'real_estate_agent', $2, false)
       RETURNING *`,
      [req.user.userId, license_number]
    );

    res.status(201).json({
      message: 'Agent registration successful',
      profession: result.rows[0]
    });
  } catch (error) {
    console.error('Error registering agent:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get agent profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT up.*, u.username, u.email, u.avatar_url,
              COUNT(DISTINCT t.id) as total_transactions,
              SUM(ac.commission_amount) as total_commissions
       FROM user_professions up
       JOIN users u ON up.user_id = u.id
       LEFT JOIN transactions t ON t.agent_id = up.user_id AND t.status = 'completed'
       LEFT JOIN agent_commissions ac ON ac.agent_id = up.user_id AND ac.status = 'paid'
       WHERE up.user_id = $1 AND up.profession_type = 'real_estate_agent'
       GROUP BY up.id, u.username, u.email, u.avatar_url`,
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Agent profile not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching agent profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all agents
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT up.*, u.username, u.email, u.avatar_url,
              COUNT(DISTINCT t.id) as total_transactions,
              SUM(ac.commission_amount) as total_commissions
       FROM user_professions up
       JOIN users u ON up.user_id = u.id
       LEFT JOIN transactions t ON t.agent_id = up.user_id AND t.status = 'completed'
       LEFT JOIN agent_commissions ac ON ac.agent_id = up.user_id AND ac.status = 'paid'
       WHERE up.profession_type = 'real_estate_agent' AND up.verified = true
       GROUP BY up.id, u.username, u.email, u.avatar_url
       ORDER BY up.rating DESC, total_transactions DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get agent commissions
router.get('/commissions', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ac.*, t.amount as transaction_amount, 
              p.title as property_title,
              u.username as buyer_name
       FROM agent_commissions ac
       JOIN transactions t ON ac.transaction_id = t.id
       JOIN properties p ON t.property_id = p.id
       LEFT JOIN users u ON t.buyer_id = u.id
       WHERE ac.agent_id = $1
       ORDER BY ac.created_at DESC`,
      [req.user.userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching commissions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
