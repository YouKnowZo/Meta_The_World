const express = require('express');
const router = express.Router();
const { db } = require('../db');

// Get all available properties
router.get('/properties', async (req, res) => {
  try {
    const { minPrice, maxPrice, type, status } = req.query;
    let query = 'SELECT * FROM properties WHERE 1=1';
    const params = [];

    if (minPrice) {
      params.push(minPrice);
      query += ` AND price >= $${params.length}`;
    }
    if (maxPrice) {
      params.push(maxPrice);
      query += ` AND price <= $${params.length}`;
    }
    if (type) {
      params.push(type);
      query += ` AND type = $${params.length}`;
    }
    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    query += ' ORDER BY created_at DESC';
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get property by ID
router.get('/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT * FROM properties WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Get property history
    const historyResult = await db.query(
      'SELECT * FROM property_transactions WHERE property_id = $1 ORDER BY created_at DESC',
      [id]
    );

    res.json({
      ...result.rows[0],
      history: historyResult.rows
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// Create new property listing (for property owners)
router.post('/properties', async (req, res) => {
  try {
    const {
      owner_id,
      title,
      description,
      type,
      price,
      coordinates,
      metadata,
      agent_id
    } = req.body;

    const result = await db.query(
      `INSERT INTO properties 
       (owner_id, title, description, type, price, coordinates, metadata, agent_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'available')
       RETURNING *`,
      [owner_id, title, description, type, price, JSON.stringify(coordinates), JSON.stringify(metadata), agent_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// Update property
router.put('/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const allowedFields = ['title', 'description', 'price', 'status', 'metadata'];
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateFields.push(`${field} = $${paramCount}`);
        values.push(field === 'metadata' ? JSON.stringify(updates[field]) : updates[field]);
        paramCount++;
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    values.push(id);
    const result = await db.query(
      `UPDATE properties SET ${updateFields.join(', ')}, updated_at = NOW()
       WHERE id = $${paramCount} RETURNING *`,
      values
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

module.exports = router;
