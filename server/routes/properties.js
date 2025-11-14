import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../database/connection.js';
import { authenticateToken } from '../middleware/auth.js';
import { io } from '../index.js';

const router = express.Router();

// Get all properties
router.get('/', async (req, res) => {
  try {
    const { status, type, minPrice, maxPrice, region } = req.query;
    let query = `
      SELECT p.*, u.username as owner_name, 
             pl.id as listing_id, pl.asking_price, pl.listing_type,
             COUNT(DISTINCT pl.id) as active_listings
      FROM properties p
      LEFT JOIN users u ON p.owner_id = u.id
      LEFT JOIN property_listings pl ON p.id = pl.property_id AND pl.status = 'active'
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (status) {
      query += ` AND p.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (type) {
      query += ` AND p.property_type = $${paramCount}`;
      params.push(type);
      paramCount++;
    }

    if (minPrice) {
      query += ` AND p.price >= $${paramCount}`;
      params.push(minPrice);
      paramCount++;
    }

    if (maxPrice) {
      query += ` AND p.price <= $${paramCount}`;
      params.push(maxPrice);
      paramCount++;
    }

    query += ` GROUP BY p.id, u.username, pl.id, pl.asking_price, pl.listing_type ORDER BY p.created_at DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get property by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT p.*, u.username as owner_name, u.email as owner_email,
              pl.id as listing_id, pl.asking_price, pl.listing_type, 
              pl.description as listing_description, pl.images, pl.virtual_tour_url,
              pl.listing_agent_id, u2.username as agent_name
       FROM properties p
       LEFT JOIN users u ON p.owner_id = u.id
       LEFT JOIN property_listings pl ON p.id = pl.property_id AND pl.status = 'active'
       LEFT JOIN users u2 ON pl.listing_agent_id = u2.id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Get features
    const features = await pool.query(
      'SELECT * FROM property_features WHERE property_id = $1',
      [id]
    );

    res.json({
      ...result.rows[0],
      features: features.rows
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create property
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      property_type,
      title,
      description,
      location_x,
      location_y,
      location_z,
      size_x,
      size_y,
      size_z,
      price,
      metadata
    } = req.body;

    const result = await pool.query(
      `INSERT INTO properties 
       (owner_id, property_type, title, description, location_x, location_y, location_z,
        size_x, size_y, size_z, price, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        req.user.userId,
        property_type,
        title,
        description,
        location_x,
        location_y,
        location_z,
        size_x,
        size_y,
        size_z,
        price,
        JSON.stringify(metadata || {})
      ]
    );

    io.emit('property-update', { type: 'created', property: result.rows[0] });

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create listing
router.post('/:id/listings', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      listing_type,
      asking_price,
      commission_rate,
      description,
      images,
      virtual_tour_url
    } = req.body;

    // Check if user owns the property
    const property = await pool.query(
      'SELECT owner_id FROM properties WHERE id = $1',
      [id]
    );

    if (property.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (property.rows[0].owner_id !== req.user.userId) {
      return res.status(403).json({ error: 'You do not own this property' });
    }

    const result = await pool.query(
      `INSERT INTO property_listings 
       (property_id, listing_agent_id, listing_type, asking_price, commission_rate,
        description, images, virtual_tour_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        id,
        req.user.userId, // Can be changed to assign to an agent
        listing_type,
        asking_price,
        commission_rate || parseFloat(process.env.AGENT_COMMISSION_RATE || 0.025),
        description,
        JSON.stringify(images || []),
        virtual_tour_url
      ]
    );

    io.emit('property-update', { type: 'listed', listing: result.rows[0] });

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
