# Setup Instructions

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

## Quick Start

1. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your MongoDB connection string and JWT secret.

3. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

4. **Run the application:**
   ```bash
   npm run dev
   ```
   This starts:
   - Backend server on http://localhost:5000
   - Frontend client on http://localhost:3000

5. **Open your browser:**
   Navigate to http://localhost:3000

## First Steps

1. Register a new account
2. Explore the 3D world (use WASD keys to move)
3. Visit the Marketplace to see available properties
4. Become an agent from the Agent Portal
5. Start buying and selling properties!

## Troubleshooting

- **MongoDB connection error:** Make sure MongoDB is running and the connection string in `.env` is correct
- **Port already in use:** Change the PORT in `.env` or kill the process using the port
- **Dependencies not installing:** Try deleting `node_modules` and `package-lock.json`, then run `npm install` again
