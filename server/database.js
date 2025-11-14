const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'meta_world.db');

let db = null;

const init = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }
      console.log('📦 Connected to SQLite database');
      createTables().then(resolve).catch(reject);
    });
  });
};

const createTables = async () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        avatar_data TEXT,
        role TEXT DEFAULT 'user',
        wallet_balance REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Properties table
      db.run(`CREATE TABLE IF NOT EXISTS properties (
        id TEXT PRIMARY KEY,
        owner_id TEXT,
        title TEXT NOT NULL,
        description TEXT,
        property_type TEXT NOT NULL,
        size REAL NOT NULL,
        price REAL NOT NULL,
        location_x REAL NOT NULL,
        location_y REAL NOT NULL,
        location_z REAL NOT NULL,
        status TEXT DEFAULT 'available',
        images TEXT,
        features TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users(id)
      )`);

      // Transactions table
      db.run(`CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        property_id TEXT NOT NULL,
        buyer_id TEXT NOT NULL,
        seller_id TEXT,
        agent_id TEXT,
        transaction_type TEXT NOT NULL,
        amount REAL NOT NULL,
        agent_commission REAL DEFAULT 0,
        commission_percentage REAL DEFAULT 0.05,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME,
        FOREIGN KEY (property_id) REFERENCES properties(id),
        FOREIGN KEY (buyer_id) REFERENCES users(id),
        FOREIGN KEY (seller_id) REFERENCES users(id),
        FOREIGN KEY (agent_id) REFERENCES users(id)
      )`);

      // Agents table (for agent-specific data)
      db.run(`CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY,
        user_id TEXT UNIQUE NOT NULL,
        license_number TEXT UNIQUE,
        total_commission REAL DEFAULT 0,
        total_transactions INTEGER DEFAULT 0,
        rating REAL DEFAULT 0,
        bio TEXT,
        specialties TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`);

      // Property listings (for agent listings)
      db.run(`CREATE TABLE IF NOT EXISTS property_listings (
        id TEXT PRIMARY KEY,
        property_id TEXT NOT NULL,
        agent_id TEXT NOT NULL,
        listing_price REAL NOT NULL,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (property_id) REFERENCES properties(id),
        FOREIGN KEY (agent_id) REFERENCES users(id)
      )`);

      // Create default admin user
      const adminPassword = bcrypt.hashSync('admin123', 10);
      db.run(`INSERT OR IGNORE INTO users (id, username, email, password_hash, role, wallet_balance)
        VALUES ('admin-001', 'admin', 'admin@metaworld.com', ?, 'admin', 1000000)`, [adminPassword]);

      console.log('✅ Database tables created successfully');
      resolve();
    });
  });
};

const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized. Call init() first.');
  }
  return db;
};

module.exports = {
  init,
  getDb
};
