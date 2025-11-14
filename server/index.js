const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

app.use(cors());
app.use(express.json());

// Initialize database
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    avatar_data TEXT,
    wallet_balance REAL DEFAULT 10000,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Properties table
  db.run(`CREATE TABLE IF NOT EXISTS properties (
    id TEXT PRIMARY KEY,
    owner_id TEXT,
    title TEXT NOT NULL,
    description TEXT,
    location_x REAL NOT NULL,
    location_y REAL NOT NULL,
    location_z REAL NOT NULL,
    price REAL NOT NULL,
    size REAL NOT NULL,
    property_type TEXT NOT NULL,
    status TEXT DEFAULT 'available',
    listed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    sold_at DATETIME,
    FOREIGN KEY (owner_id) REFERENCES users(id)
  )`);

  // Transactions table
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    property_id TEXT NOT NULL,
    buyer_id TEXT NOT NULL,
    seller_id TEXT NOT NULL,
    agent_id TEXT,
    price REAL NOT NULL,
    commission REAL DEFAULT 0,
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id),
    FOREIGN KEY (buyer_id) REFERENCES users(id),
    FOREIGN KEY (seller_id) REFERENCES users(id),
    FOREIGN KEY (agent_id) REFERENCES users(id)
  )`);

  // Listings table (properties for sale)
  db.run(`CREATE TABLE IF NOT EXISTS listings (
    id TEXT PRIMARY KEY,
    property_id TEXT NOT NULL,
    agent_id TEXT,
    listing_price REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'active',
    FOREIGN KEY (property_id) REFERENCES properties(id),
    FOREIGN KEY (agent_id) REFERENCES users(id)
  )`);
});

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password, role } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    
    db.run(
      'INSERT INTO users (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [userId, username, email, hashedPassword, role || 'user'],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Username or email already exists' });
          }
          return res.status(500).json({ error: 'Database error' });
        }
        
        const token = jwt.sign({ id: userId, username, role: role || 'user' }, JWT_SECRET);
        res.json({ token, user: { id: userId, username, email, role: role || 'user' } });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, username], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET);
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        role: user.role,
        wallet_balance: user.wallet_balance
      } 
    });
  });
});

// User routes
app.get('/api/users/me', authenticateToken, (req, res) => {
  db.get('SELECT id, username, email, role, wallet_balance, avatar_data FROM users WHERE id = ?', 
    [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  });
});

// Properties routes
app.get('/api/properties', (req, res) => {
  db.all(`
    SELECT p.*, u.username as owner_name 
    FROM properties p 
    LEFT JOIN users u ON p.owner_id = u.id
    ORDER BY p.listed_at DESC
  `, (err, properties) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(properties);
  });
});

app.get('/api/properties/:id', (req, res) => {
  db.get(`
    SELECT p.*, u.username as owner_name 
    FROM properties p 
    LEFT JOIN users u ON p.owner_id = u.id
    WHERE p.id = ?
  `, [req.params.id], (err, property) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!property) return res.status(404).json({ error: 'Property not found' });
    res.json(property);
  });
});

app.post('/api/properties', authenticateToken, (req, res) => {
  const { title, description, location_x, location_y, location_z, price, size, property_type } = req.body;
  
  if (!title || !location_x || !location_y || !location_z || !price || !size || !property_type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const propertyId = uuidv4();
  db.run(
    `INSERT INTO properties (id, owner_id, title, description, location_x, location_y, location_z, price, size, property_type)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [propertyId, req.user.id, title, description, location_x, location_y, location_z, price, size, property_type],
    function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ id: propertyId, message: 'Property created' });
    }
  );
});

// Listings routes
app.get('/api/listings', (req, res) => {
  db.all(`
    SELECT l.*, p.*, u.username as owner_name, a.username as agent_name
    FROM listings l
    JOIN properties p ON l.property_id = p.id
    LEFT JOIN users u ON p.owner_id = u.id
    LEFT JOIN users a ON l.agent_id = a.id
    WHERE l.status = 'active'
    ORDER BY l.created_at DESC
  `, (err, listings) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(listings);
  });
});

app.post('/api/listings', authenticateToken, (req, res) => {
  const { property_id, listing_price, agent_id } = req.body;
  
  if (!property_id || !listing_price) {
    return res.status(400).json({ error: 'Property ID and listing price required' });
  }

  // Check if user owns the property or is an agent
  db.get('SELECT owner_id FROM properties WHERE id = ?', [property_id], (err, property) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!property) return res.status(404).json({ error: 'Property not found' });
    
    const isOwner = property.owner_id === req.user.id;
    const isAgent = req.user.role === 'agent' || req.user.role === 'admin';
    
    if (!isOwner && !isAgent) {
      return res.status(403).json({ error: 'Not authorized to list this property' });
    }

    const listingId = uuidv4();
    const finalAgentId = agent_id || (isAgent ? req.user.id : null);
    
    db.run(
      `INSERT INTO listings (id, property_id, agent_id, listing_price)
       VALUES (?, ?, ?, ?)`,
      [listingId, property_id, finalAgentId, listing_price],
      function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        
        // Update property status
        db.run('UPDATE properties SET status = ? WHERE id = ?', ['listed', property_id]);
        
        res.json({ id: listingId, message: 'Property listed successfully' });
      }
    );
  });
});

// Transaction routes
app.post('/api/transactions', authenticateToken, (req, res) => {
  const { property_id, listing_id } = req.body;
  
  db.get(`
    SELECT l.*, p.*, p.owner_id as seller_id
    FROM listings l
    JOIN properties p ON l.property_id = p.id
    WHERE l.id = ? AND l.status = 'active'
  `, [listing_id], (err, listing) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    
    if (listing.seller_id === req.user.id) {
      return res.status(400).json({ error: 'Cannot buy your own property' });
    }

    // Check buyer has enough funds
    db.get('SELECT wallet_balance FROM users WHERE id = ?', [req.user.id], (err, buyer) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (buyer.wallet_balance < listing.listing_price) {
        return res.status(400).json({ error: 'Insufficient funds' });
      }

      // Calculate commission (5% for agents)
      const commission = listing.agent_id ? listing.listing_price * 0.05 : 0;
      const sellerAmount = listing.listing_price - commission;

      // Start transaction
      const transactionId = uuidv4();
      
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        
        // Create transaction record
        db.run(
          `INSERT INTO transactions (id, property_id, buyer_id, seller_id, agent_id, price, commission)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [transactionId, listing.property_id, req.user.id, listing.seller_id, listing.agent_id, listing.listing_price, commission]
        );
        
        // Update buyer balance
        db.run(
          'UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?',
          [listing.listing_price, req.user.id]
        );
        
        // Update seller balance
        db.run(
          'UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?',
          [sellerAmount, listing.seller_id]
        );
        
        // Update agent balance (if agent exists)
        if (listing.agent_id) {
          db.run(
            'UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?',
            [commission, listing.agent_id]
          );
        }
        
        // Update property ownership
        db.run(
          'UPDATE properties SET owner_id = ?, status = ? WHERE id = ?',
          [req.user.id, 'sold', listing.property_id]
        );
        
        // Close listing
        db.run('UPDATE listings SET status = ? WHERE id = ?', ['sold', listing_id]);
        
        db.run('COMMIT', (err) => {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: 'Transaction failed' });
          }
          res.json({ id: transactionId, message: 'Transaction completed successfully', commission });
        });
      });
    });
  });
});

// Get user transactions
app.get('/api/transactions', authenticateToken, (req, res) => {
  db.all(`
    SELECT t.*, p.title as property_title, 
           buyer.username as buyer_name, 
           seller.username as seller_name,
           agent.username as agent_name
    FROM transactions t
    JOIN properties p ON t.property_id = p.id
    JOIN users buyer ON t.buyer_id = buyer.id
    JOIN users seller ON t.seller_id = seller.id
    LEFT JOIN users agent ON t.agent_id = agent.id
    WHERE t.buyer_id = ? OR t.seller_id = ? OR t.agent_id = ?
    ORDER BY t.transaction_date DESC
  `, [req.user.id, req.user.id, req.user.id], (err, transactions) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(transactions);
  });
});

// Get agent statistics
app.get('/api/agents/stats', authenticateToken, (req, res) => {
  if (req.user.role !== 'agent' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Agent access required' });
  }

  db.get(`
    SELECT 
      COUNT(*) as total_transactions,
      SUM(commission) as total_commission,
      AVG(commission) as avg_commission
    FROM transactions
    WHERE agent_id = ?
  `, [req.user.id], (err, stats) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(stats || { total_transactions: 0, total_commission: 0, avg_commission: 0 });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
