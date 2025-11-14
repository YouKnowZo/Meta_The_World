import express from 'express';
import pool from '../database/connection.js';

const router = express.Router();

// Get world regions
router.get('/regions', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM world_regions ORDER BY name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching regions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get world stats
router.get('/stats', async (req, res) => {
  try {
    const [users, properties, transactions, agents] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM users'),
      pool.query('SELECT COUNT(*) as count FROM properties'),
      pool.query("SELECT COUNT(*) as count, SUM(amount) as total_volume FROM transactions WHERE status = 'completed'"),
      pool.query("SELECT COUNT(*) as count FROM user_professions WHERE profession_type = 'real_estate_agent'")
    ]);

    res.json({
      total_users: parseInt(users.rows[0].count),
      total_properties: parseInt(properties.rows[0].count),
      total_transactions: parseInt(transactions.rows[0].count),
      total_volume: parseFloat(transactions.rows[0].total_volume || 0),
      total_agents: parseInt(agents.rows[0].count)
    });
  } catch (error) {
    console.error('Error fetching world stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
