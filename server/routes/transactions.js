const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database');
const { authenticateToken } = require('./auth');

const router = express.Router();

// Get all transactions
router.get('/', authenticateToken, (req, res) => {
  const db = getDb();
  const { userId } = req.user;

  db.all(
    `SELECT t.*, 
            p.title as property_title, p.property_type,
            buyer.username as buyer_name,
            seller.username as seller_name,
            agent.username as agent_name
     FROM transactions t
     JOIN properties p ON t.property_id = p.id
     LEFT JOIN users buyer ON t.buyer_id = buyer.id
     LEFT JOIN users seller ON t.seller_id = seller.id
     LEFT JOIN users agent ON t.agent_id = agent.id
     WHERE t.buyer_id = ? OR t.seller_id = ? OR t.agent_id = ?
     ORDER BY t.created_at DESC`,
    [userId, userId, userId],
    (err, transactions) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch transactions' });
      }
      res.json(transactions);
    }
  );
});

// Create transaction (purchase property)
router.post('/', authenticateToken, (req, res) => {
  const db = getDb();
  const { propertyId, agentId, commissionPercentage = 0.05 } = req.body;
  const buyerId = req.user.userId;

  // Start transaction
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    // Get property details
    db.get(`SELECT * FROM properties WHERE id = ?`, [propertyId], (err, property) => {
      if (err || !property) {
        db.run('ROLLBACK');
        return res.status(404).json({ error: 'Property not found' });
      }

      if (property.status !== 'available') {
        db.run('ROLLBACK');
        return res.status(400).json({ error: 'Property is not available' });
      }

      if (property.owner_id === buyerId) {
        db.run('ROLLBACK');
        return res.status(400).json({ error: 'Cannot buy your own property' });
      }

      // Check buyer balance
      db.get(`SELECT wallet_balance FROM users WHERE id = ?`, [buyerId], (err, buyer) => {
        if (err || !buyer) {
          db.run('ROLLBACK');
          return res.status(404).json({ error: 'Buyer not found' });
        }

        const totalAmount = property.price;
        const agentCommission = agentId ? totalAmount * commissionPercentage : 0;
        const sellerAmount = totalAmount - agentCommission;

        if (buyer.wallet_balance < totalAmount) {
          db.run('ROLLBACK');
          return res.status(400).json({ error: 'Insufficient funds' });
        }

        // Create transaction record
        const transactionId = uuidv4();
        db.run(
          `INSERT INTO transactions (
            id, property_id, buyer_id, seller_id, agent_id,
            transaction_type, amount, agent_commission, commission_percentage, status
          ) VALUES (?, ?, ?, ?, ?, 'purchase', ?, ?, ?, 'completed')`,
          [
            transactionId,
            propertyId,
            buyerId,
            property.owner_id,
            agentId || null,
            totalAmount,
            agentCommission,
            commissionPercentage
          ],
          function(err) {
            if (err) {
              db.run('ROLLBACK');
              return res.status(500).json({ error: 'Failed to create transaction' });
            }

            // Update buyer balance
            db.run(
              `UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?`,
              [totalAmount, buyerId],
              (err) => {
                if (err) {
                  db.run('ROLLBACK');
                  return res.status(500).json({ error: 'Failed to update buyer balance' });
                }

                // Update seller balance
                if (property.owner_id) {
                  db.run(
                    `UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?`,
                    [sellerAmount, property.owner_id],
                    (err) => {
                      if (err) {
                        db.run('ROLLBACK');
                        return res.status(500).json({ error: 'Failed to update seller balance' });
                      }

                      // Update agent commission if exists
                      if (agentId) {
                        db.run(
                          `UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?`,
                          [agentCommission, agentId],
                          (err) => {
                            if (err) {
                              db.run('ROLLBACK');
                              return res.status(500).json({ error: 'Failed to update agent balance' });
                            }

                            // Update agent stats
                            db.run(
                              `UPDATE agents SET 
                                total_commission = total_commission + ?,
                                total_transactions = total_transactions + 1
                               WHERE user_id = ?`,
                              [agentCommission, agentId],
                              (err) => {
                                if (err) {
                                  console.error('Failed to update agent stats:', err);
                                }
                              }
                            );

                            // Transfer property ownership
                            db.run(
                              `UPDATE properties SET owner_id = ?, status = 'sold' WHERE id = ?`,
                              [buyerId, propertyId],
                              (err) => {
                                if (err) {
                                  db.run('ROLLBACK');
                                  return res.status(500).json({ error: 'Failed to transfer property' });
                                }

                                db.run('COMMIT', (err) => {
                                  if (err) {
                                    return res.status(500).json({ error: 'Transaction commit failed' });
                                  }
                                  res.json({
                                    id: transactionId,
                                    message: 'Transaction completed successfully',
                                    agentCommission,
                                    sellerAmount
                                  });
                                });
                              }
                            );
                          }
                        );
                      } else {
                        // No agent, just transfer property
                        db.run(
                          `UPDATE properties SET owner_id = ?, status = 'sold' WHERE id = ?`,
                          [buyerId, propertyId],
                          (err) => {
                            if (err) {
                              db.run('ROLLBACK');
                              return res.status(500).json({ error: 'Failed to transfer property' });
                            }

                            db.run('COMMIT', (err) => {
                              if (err) {
                                return res.status(500).json({ error: 'Transaction commit failed' });
                              }
                              res.json({
                                id: transactionId,
                                message: 'Transaction completed successfully',
                                agentCommission: 0,
                                sellerAmount
                              });
                            });
                          }
                        );
                      }
                    }
                  );
                } else {
                  // No seller (new property)
                  db.run(
                    `UPDATE properties SET owner_id = ?, status = 'sold' WHERE id = ?`,
                    [buyerId, propertyId],
                    (err) => {
                      if (err) {
                        db.run('ROLLBACK');
                        return res.status(500).json({ error: 'Failed to transfer property' });
                      }

                      db.run('COMMIT', (err) => {
                        if (err) {
                          return res.status(500).json({ error: 'Transaction commit failed' });
                        }
                        res.json({
                          id: transactionId,
                          message: 'Transaction completed successfully',
                          agentCommission,
                          sellerAmount: totalAmount - agentCommission
                        });
                      });
                    }
                  );
                }
              }
            );
          }
        );
      });
    });
  });
});

module.exports = router;
