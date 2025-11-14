#!/bin/bash

echo "🌍 Meta The World - Setup Script"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed. Please install PostgreSQL 14+ first."
    echo "   You can still continue, but you'll need to set up the database manually."
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "📝 Setting up environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file. Please update it with your database credentials."
else
    echo "ℹ️  .env file already exists."
fi

echo ""
echo "🗄️  Database Setup"
echo "To set up the database, run:"
echo "  createdb meta_the_world"
echo "  psql -d meta_the_world -f server/database/schema.sql"
echo ""

echo "✅ Setup complete!"
echo ""
echo "To start the development servers, run:"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser."
echo ""
