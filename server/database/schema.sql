-- Meta The World Database Schema
-- Hyper-realistic virtual world with real estate system

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    avatar_data JSONB,
    wallet_address VARCHAR(255),
    balance DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- User roles and professions
CREATE TABLE IF NOT EXISTS user_professions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    profession_type VARCHAR(50) NOT NULL, -- 'real_estate_agent', 'architect', 'developer', 'artist', etc.
    license_number VARCHAR(100),
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_transactions INTEGER DEFAULT 0,
    total_earnings DECIMAL(15, 2) DEFAULT 0.00,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Properties/Land parcels
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    property_type VARCHAR(50) NOT NULL, -- 'land', 'residential', 'commercial', 'industrial', 'mixed_use'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location_x DECIMAL(10, 2) NOT NULL,
    location_y DECIMAL(10, 2) NOT NULL,
    location_z DECIMAL(10, 2) NOT NULL,
    size_x DECIMAL(10, 2) NOT NULL,
    size_y DECIMAL(10, 2) NOT NULL,
    size_z DECIMAL(10, 2) NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'MTC', -- Meta The World Currency
    status VARCHAR(20) DEFAULT 'available', -- 'available', 'sold', 'rented', 'under_construction'
    nft_token_id VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Property listings (for sale/rent)
CREATE TABLE IF NOT EXISTS property_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    listing_agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
    listing_type VARCHAR(20) NOT NULL, -- 'sale', 'rent'
    asking_price DECIMAL(15, 2) NOT NULL,
    commission_rate DECIMAL(5, 4) DEFAULT 0.025, -- 2.5% default
    description TEXT,
    images JSONB,
    virtual_tour_url TEXT,
    open_house_times JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active' -- 'active', 'pending', 'sold', 'expired'
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    seller_id UUID REFERENCES users(id) ON DELETE SET NULL,
    agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
    transaction_type VARCHAR(20) NOT NULL, -- 'sale', 'rent', 'lease'
    amount DECIMAL(15, 2) NOT NULL,
    commission_amount DECIMAL(15, 2) DEFAULT 0.00,
    commission_rate DECIMAL(5, 4),
    currency VARCHAR(10) DEFAULT 'MTC',
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'cancelled', 'disputed'
    contract_data JSONB,
    blockchain_tx_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Agent commissions tracking
CREATE TABLE IF NOT EXISTS agent_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES users(id) ON DELETE CASCADE,
    commission_amount DECIMAL(15, 2) NOT NULL,
    commission_rate DECIMAL(5, 4) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'disputed'
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Property features and amenities
CREATE TABLE IF NOT EXISTS property_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    feature_type VARCHAR(50) NOT NULL, -- 'building', 'landscape', 'interior', 'technology', etc.
    feature_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User avatars and customization
CREATE TABLE IF NOT EXISTS user_avatars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    avatar_model JSONB NOT NULL,
    clothing JSONB,
    accessories JSONB,
    animations JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- World regions and districts
CREATE TABLE IF NOT EXISTS world_regions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    region_type VARCHAR(50), -- 'residential', 'commercial', 'industrial', 'recreational', 'mixed'
    coordinates JSONB NOT NULL,
    properties_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_owner ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location_x, location_y, location_z);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_listings_agent ON property_listings(listing_agent_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON property_listings(status);
CREATE INDEX IF NOT EXISTS idx_transactions_agent ON transactions(agent_id);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller ON transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_commissions_agent ON agent_commissions(agent_id);
CREATE INDEX IF NOT EXISTS idx_user_professions_user ON user_professions(user_id);
