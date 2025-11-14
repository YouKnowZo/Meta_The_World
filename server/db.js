const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'meta_the_world',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

// Database initialization
async function initDatabase() {
  try {
    // Create tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        wallet_address VARCHAR(255),
        balance DECIMAL(15, 2) DEFAULT 0,
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS agents (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE REFERENCES users(id),
        license_number VARCHAR(50),
        bio TEXT,
        specialties JSONB,
        commission_rate DECIMAL(5, 4) DEFAULT 0.03,
        rating DECIMAL(3, 2),
        total_sales DECIMAL(15, 2) DEFAULT 0,
        total_commission DECIMAL(15, 2) DEFAULT 0,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        owner_id INTEGER REFERENCES users(id),
        agent_id INTEGER REFERENCES agents(user_id),
        title VARCHAR(200) NOT NULL,
        description TEXT,
        type VARCHAR(50) NOT NULL,
        price DECIMAL(15, 2) NOT NULL,
        coordinates JSONB NOT NULL,
        metadata JSONB,
        status VARCHAR(20) DEFAULT 'available',
        nft_token_id VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS property_transactions (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id),
        buyer_id INTEGER REFERENCES users(id),
        seller_id INTEGER REFERENCES users(id),
        agent_id INTEGER REFERENCES agents(user_id),
        price DECIMAL(15, 2) NOT NULL,
        commission DECIMAL(15, 2) DEFAULT 0,
        status VARCHAR(20) DEFAULT 'pending',
        transaction_hash VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_properties_coordinates ON properties USING GIN (coordinates);
      CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
      CREATE INDEX IF NOT EXISTS idx_properties_agent ON properties(agent_id);
      CREATE INDEX IF NOT EXISTS idx_transactions_buyer ON property_transactions(buyer_id);
      CREATE INDEX IF NOT EXISTS idx_transactions_seller ON property_transactions(seller_id);
      CREATE INDEX IF NOT EXISTS idx_transactions_agent ON property_transactions(agent_id);
    `);

    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
}

// Initialize on module load
initDatabase();

module.exports = {
  db: {
    query: (text, params) => pool.query(text, params),
  },
  pool
};
