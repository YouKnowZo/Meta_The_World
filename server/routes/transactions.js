import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../database/connection.js';
import { authenticateToken } from '../middleware/auth.js';
import { io } from '../index.js';

const router = express.Router();

// Create transaction
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      property_id,
      listing_id,
      transaction_type,
      amount,
      agent_id
    } = req.body;

    // Get listing details
    const listing = await pool.query(
      `SELECT pl.*, p.owner_id as seller_id, p.status as property_status
       FROM property_listings pl
       JOIN properties p ON pl.property_id = p.id
       WHERE pl.id = $1 AND pl.status = 'active'`,
      [listing_id]
    );

    if (listing.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found or not active' });
    }

    const listingData = listing.rows[0];

    // Calculate commission
    const commissionRate = listingData.commission_rate || parseFloat(process.env.AGENT_COMMISSION_RATE || 0.025);
    const commissionAmount = amount * commissionRate;

    // Create transaction
    const transactionResult = await pool.query(
      `INSERT INTO transactions 
       (property_id, buyer_id, seller_id, agent_id, transaction_type, 
        amount, commission_amount, commission_rate, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
       RETURNING *`,
      [
        property_id,
        req.user.userId,
        listingData.seller_id,
        agent_id || listingData.listing_agent_id,
        transaction_type,
        amount,
        commissionAmount,
        commissionRate
      ]
    );

    const transaction = transactionResult.rows[0];

    // Create commission record if agent is involved
    if (transaction.agent_id) {
      await pool.query(
        `INSERT INTO agent_commissions 
         (transaction_id, agent_id, commission_amount, commission_rate, status)
         VALUES ($1, $2, $3, $4, 'pending')`,
        [
          transaction.id,
          transaction.agent_id,
          commissionAmount,
          commissionRate
        ]
      );
    }

    io.emit('transaction-update', { type: 'created', transaction });

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Complete transaction
router.post('/:id/complete', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await pool.query(
      'SELECT * FROM transactions WHERE id = $1',
      [id]
    );

    if (transaction.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const tx = transaction.rows[0];

    // Verify user has permission (buyer, seller, or agent)
    if (tx.buyer_id !== req.user.userId && 
        tx.seller_id !== req.user.userId && 
        tx.agent_id !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Update transaction status
      await client.query(
        `UPDATE transactions 
         SET status = 'completed', completed_at = CURRENT_TIMESTAMP 
         WHERE id = $1`,
        [id]
      );

      // Transfer property ownership
      await client.query(
        'UPDATE properties SET owner_id = $1, status = $2 WHERE id = $3',
        [tx.buyer_id, 'sold', tx.property_id]
      );

      // Update listing status
      await client.query(
        `UPDATE property_listings 
         SET status = 'sold' 
         WHERE property_id = $1 AND status = 'active'`,
        [tx.property_id]
      );

      // Update balances
      // Seller receives amount - commission
      const sellerAmount = tx.amount - tx.commission_amount;
      await client.query(
        'UPDATE users SET balance = balance + $1 WHERE id = $2',
        [sellerAmount, tx.seller_id]
      );

      // Agent receives commission
      if (tx.agent_id) {
        await client.query(
          'UPDATE users SET balance = balance + $1 WHERE id = $2',
          [tx.commission_amount, tx.agent_id]
        );

        // Update commission status
        await client.query(
          `UPDATE agent_commissions 
           SET status = 'paid', paid_at = CURRENT_TIMESTAMP 
           WHERE transaction_id = $1`,
          [id]
        );

        // Update agent stats
        await client.query(
          `UPDATE user_professions 
           SET total_transactions = total_transactions + 1,
               total_earnings = total_earnings + $1
           WHERE user_id = $2 AND profession_type = 'real_estate_agent'`,
          [tx.commission_amount, tx.agent_id]
        );
      }

      await client.query('COMMIT');

      io.emit('transaction-update', { type: 'completed', transaction: { ...tx, status: 'completed' } });

      res.json({ message: 'Transaction completed successfully', transaction_id: id });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error completing transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user transactions
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user can access these transactions
    if (userId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      `SELECT t.*, p.title as property_title, 
              u1.username as buyer_name, u2.username as seller_name,
              u3.username as agent_name
       FROM transactions t
       LEFT JOIN properties p ON t.property_id = p.id
       LEFT JOIN users u1 ON t.buyer_id = u1.id
       LEFT JOIN users u2 ON t.seller_id = u2.id
       LEFT JOIN users u3 ON t.agent_id = u3.id
       WHERE t.buyer_id = $1 OR t.seller_id = $1 OR t.agent_id = $1
       ORDER BY t.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
