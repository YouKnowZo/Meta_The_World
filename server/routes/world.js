const express = require('express');
const router = express.Router();
const { db } = require('../db');

// Get world map data
router.get('/map', async (req, res) => {
  try {
    const { bounds } = req.query; // e.g., "x1,y1,x2,y2"
    
    let query = `
      SELECT id, title, type, price, status, coordinates, owner_id, agent_id
      FROM properties
      WHERE status IN ('available', 'sold')
    `;

    if (bounds) {
      const [x1, y1, x2, y2] = bounds.split(',').map(Number);
      query += ` AND (
        (coordinates->>'x')::float BETWEEN $1 AND $3
        AND (coordinates->>'y')::float BETWEEN $2 AND $4
      )`;
      const result = await db.query(query, [x1, y1, x2, y2]);
      return res.json(result.rows);
    }

    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching world map:', error);
    res.status(500).json({ error: 'Failed to fetch world map' });
  }
});

// Get world statistics
router.get('/stats', async (req, res) => {
  try {
    const statsResult = await db.query(`
      SELECT 
        COUNT(*) as total_properties,
        COUNT(CASE WHEN status = 'available' THEN 1 END) as available_properties,
        COUNT(CASE WHEN status = 'sold' THEN 1 END) as sold_properties,
        SUM(CASE WHEN status = 'sold' THEN price ELSE 0 END) as total_value_sold,
        AVG(CASE WHEN status = 'sold' THEN price ELSE NULL END) as avg_sale_price,
        COUNT(DISTINCT owner_id) as total_owners,
        COUNT(DISTINCT agent_id) as active_agents
      FROM properties
    `);

    const userStatsResult = await db.query(`
      SELECT COUNT(*) as total_users FROM users
    `);

    res.json({
      ...statsResult.rows[0],
      ...userStatsResult.rows[0]
    });
  } catch (error) {
    console.error('Error fetching world stats:', error);
    res.status(500).json({ error: 'Failed to fetch world statistics' });
  }
});

module.exports = router;
