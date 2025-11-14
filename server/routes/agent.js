const express = require('express');
const router = express.Router();
const { db } = require('../db');

// Get agent profile
router.get('/profile/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    
    // Get agent info
    const agentResult = await db.query(
      'SELECT * FROM agents WHERE user_id = $1',
      [agentId]
    );

    if (agentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const agent = agentResult.rows[0];

    // Get agent statistics
    const statsResult = await db.query(
      `SELECT 
        COUNT(*) as total_listings,
        COUNT(CASE WHEN status = 'sold' THEN 1 END) as sold_count,
        SUM(CASE WHEN status = 'sold' THEN price ELSE 0 END) as total_sales,
        SUM(CASE WHEN status = 'sold' THEN commission ELSE 0 END) as total_commission
       FROM properties 
       WHERE agent_id = $1`,
      [agentId]
    );

    // Get recent transactions
    const transactionsResult = await db.query(
      `SELECT pt.*, p.title, p.type 
       FROM property_transactions pt
       JOIN properties p ON pt.property_id = p.id
       WHERE pt.agent_id = $1
       ORDER BY pt.created_at DESC
       LIMIT 10`,
      [agentId]
    );

    res.json({
      ...agent,
      stats: statsResult.rows[0],
      recentTransactions: transactionsResult.rows
    });
  } catch (error) {
    console.error('Error fetching agent profile:', error);
    res.status(500).json({ error: 'Failed to fetch agent profile' });
  }
});

// Register as agent
router.post('/register', async (req, res) => {
  try {
    const { userId, licenseNumber, bio, specialties, commissionRate } = req.body;

    // Default commission rate if not provided (e.g., 3%)
    const rate = commissionRate || 0.03;

    const result = await db.query(
      `INSERT INTO agents (user_id, license_number, bio, specialties, commission_rate, status)
       VALUES ($1, $2, $3, $4, $5, 'active')
       ON CONFLICT (user_id) DO UPDATE SET
         license_number = EXCLUDED.license_number,
         bio = EXCLUDED.bio,
         specialties = EXCLUDED.specialties,
         commission_rate = EXCLUDED.commission_rate,
         updated_at = NOW()
       RETURNING *`,
      [userId, licenseNumber, bio, JSON.stringify(specialties || []), rate]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error registering agent:', error);
    res.status(500).json({ error: 'Failed to register as agent' });
  }
});

// Get agent's listings
router.get('/listings/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { status } = req.query;

    let query = 'SELECT * FROM properties WHERE agent_id = $1';
    const params = [agentId];

    if (status) {
      query += ' AND status = $2';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching agent listings:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// Get available agents
router.get('/available', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT a.*, u.username, u.avatar_url
       FROM agents a
       JOIN users u ON a.user_id = u.id
       WHERE a.status = 'active'
       ORDER BY a.rating DESC NULLS LAST, a.total_sales DESC NULLS LAST
       LIMIT 50`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

module.exports = router;
