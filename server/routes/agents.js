const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database');
const { authenticateToken } = require('./auth');

const router = express.Router();

// Become an agent
router.post('/register', authenticateToken, (req, res) => {
  const db = getDb();
  const { licenseNumber, bio, specialties } = req.body;
  const userId = req.user.userId;

  // Check if already an agent
  db.get(`SELECT * FROM agents WHERE user_id = ?`, [userId], (err, existing) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (existing) {
      return res.status(400).json({ error: 'User is already registered as an agent' });
    }

    const agentId = uuidv4();
    db.run(
      `INSERT INTO agents (id, user_id, license_number, bio, specialties)
       VALUES (?, ?, ?, ?, ?)`,
      [agentId, userId, licenseNumber || `LIC-${Date.now()}`, bio || '', JSON.stringify(specialties || [])],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to register as agent' });
        }

        // Update user role
        db.run(`UPDATE users SET role = 'agent' WHERE id = ?`, [userId], (err) => {
          if (err) {
            console.error('Failed to update user role:', err);
          }
        });

        res.json({ message: 'Successfully registered as real estate agent', agentId });
      }
    );
  });
});

// Get agent profile
router.get('/:userId', (req, res) => {
  const db = getDb();
  db.get(
    `SELECT a.*, u.username, u.email, u.wallet_balance
     FROM agents a
     JOIN users u ON a.user_id = u.id
     WHERE a.user_id = ?`,
    [req.params.userId],
    (err, agent) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch agent' });
      }
      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
      }
      res.json({
        ...agent,
        specialties: agent.specialties ? JSON.parse(agent.specialties) : []
      });
    }
  );
});

// Get all agents
router.get('/', (req, res) => {
  const db = getDb();
  db.all(
    `SELECT a.*, u.username, u.email
     FROM agents a
     JOIN users u ON a.user_id = u.id
     ORDER BY a.total_transactions DESC, a.total_commission DESC`,
    (err, agents) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch agents' });
      }
      res.json(agents.map(a => ({
        ...a,
        specialties: a.specialties ? JSON.parse(a.specialties) : []
      })));
    }
  );
});

// Get agent's transactions
router.get('/:userId/transactions', authenticateToken, (req, res) => {
  const db = getDb();
  const { userId } = req.params;

  // Verify access
  if (userId !== req.user.userId && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized' });
  }

  db.all(
    `SELECT t.*, p.title as property_title, p.property_type,
            buyer.username as buyer_name,
            seller.username as seller_name
     FROM transactions t
     JOIN properties p ON t.property_id = p.id
     LEFT JOIN users buyer ON t.buyer_id = buyer.id
     LEFT JOIN users seller ON t.seller_id = seller.id
     WHERE t.agent_id = ?
     ORDER BY t.created_at DESC`,
    [userId],
    (err, transactions) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch transactions' });
      }
      res.json(transactions);
    }
  );
});

// Create property listing (agent lists a property)
router.post('/listings', authenticateToken, (req, res) => {
  const db = getDb();
  const { propertyId, listingPrice } = req.body;
  const agentId = req.user.userId;

  // Verify user is an agent
  db.get(`SELECT * FROM agents WHERE user_id = ?`, [agentId], (err, agent) => {
    if (err || !agent) {
      return res.status(403).json({ error: 'User is not registered as an agent' });
    }

    // Check property exists
    db.get(`SELECT * FROM properties WHERE id = ?`, [propertyId], (err, property) => {
      if (err || !property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      const listingId = uuidv4();
      db.run(
        `INSERT INTO property_listings (id, property_id, agent_id, listing_price)
         VALUES (?, ?, ?, ?)`,
        [listingId, propertyId, agentId, listingPrice || property.price],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create listing' });
          }
          res.json({ id: listingId, message: 'Property listed successfully' });
        }
      );
    });
  });
});

module.exports = router;
