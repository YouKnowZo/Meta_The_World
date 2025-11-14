const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database');
const { authenticateToken } = require('./auth');

const router = express.Router();

// Get all properties
router.get('/', (req, res) => {
  const db = getDb();
  const { status, type, minPrice, maxPrice } = req.query;

  let query = `SELECT p.*, u.username as owner_name 
               FROM properties p 
               LEFT JOIN users u ON p.owner_id = u.id 
               WHERE 1=1`;
  const params = [];

  if (status) {
    query += ` AND p.status = ?`;
    params.push(status);
  }
  if (type) {
    query += ` AND p.property_type = ?`;
    params.push(type);
  }
  if (minPrice) {
    query += ` AND p.price >= ?`;
    params.push(minPrice);
  }
  if (maxPrice) {
    query += ` AND p.price <= ?`;
    params.push(maxPrice);
  }

  query += ` ORDER BY p.created_at DESC`;

  db.all(query, params, (err, properties) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch properties' });
    }
    res.json(properties.map(p => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : [],
      features: p.features ? JSON.parse(p.features) : []
    })));
  });
});

// Get single property
router.get('/:id', (req, res) => {
  const db = getDb();
  db.get(
    `SELECT p.*, u.username as owner_name 
     FROM properties p 
     LEFT JOIN users u ON p.owner_id = u.id 
     WHERE p.id = ?`,
    [req.params.id],
    (err, property) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch property' });
      }
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }
      res.json({
        ...property,
        images: property.images ? JSON.parse(property.images) : [],
        features: property.features ? JSON.parse(property.features) : []
      });
    }
  );
});

// Create property
router.post('/', authenticateToken, (req, res) => {
  const db = getDb();
  const {
    title,
    description,
    property_type,
    size,
    price,
    location_x,
    location_y,
    location_z,
    images,
    features
  } = req.body;

  const propertyId = uuidv4();

  db.run(
    `INSERT INTO properties (
      id, owner_id, title, description, property_type, size, price,
      location_x, location_y, location_z, images, features
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      propertyId,
      req.user.userId,
      title,
      description,
      property_type,
      size,
      price,
      location_x || 0,
      location_y || 0,
      location_z || 0,
      JSON.stringify(images || []),
      JSON.stringify(features || [])
    ],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create property' });
      }
      res.json({ id: propertyId, message: 'Property created successfully' });
    }
  );
});

// Update property
router.put('/:id', authenticateToken, (req, res) => {
  const db = getDb();
  const { title, description, price, status, images, features } = req.body;

  // Check ownership
  db.get(`SELECT owner_id FROM properties WHERE id = ?`, [req.params.id], (err, property) => {
    if (err || !property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (property.owner_id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updates = [];
    const params = [];

    if (title) { updates.push('title = ?'); params.push(title); }
    if (description !== undefined) { updates.push('description = ?'); params.push(description); }
    if (price) { updates.push('price = ?'); params.push(price); }
    if (status) { updates.push('status = ?'); params.push(status); }
    if (images) { updates.push('images = ?'); params.push(JSON.stringify(images)); }
    if (features) { updates.push('features = ?'); params.push(JSON.stringify(features)); }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }

    params.push(req.params.id);

    db.run(
      `UPDATE properties SET ${updates.join(', ')} WHERE id = ?`,
      params,
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to update property' });
        }
        res.json({ message: 'Property updated successfully' });
      }
    );
  });
});

module.exports = router;
