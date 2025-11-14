# 🌍 Meta The World

A hyper-realistic virtual world metaverse where you can be anything you want to be. Experience a fully immersive 3D environment with a complete real estate system, agent commissions, and an economy that mirrors the real world—but better.

## ✨ Features

### 🏠 Real Estate System
- **Property Ownership**: Buy, sell, and own virtual properties
- **Property Listings**: Create detailed listings with virtual tours
- **Location-Based**: Properties exist in 3D space with coordinates
- **Multiple Property Types**: Residential, commercial, industrial, mixed-use, and land parcels
- **NFT Integration Ready**: Built-in support for blockchain-based property ownership

### 🏢 Real Estate Agent System
- **Become an Agent**: Register as a licensed real estate agent
- **Commission Tracking**: Automatic commission calculation on every transaction
- **Default Commission Rate**: 2.5% (configurable)
- **Transaction History**: Track all your deals and earnings
- **Agent Dashboard**: Monitor your performance, ratings, and commissions

### 💰 Economy & Transactions
- **Virtual Currency (MTC)**: Meta The World Currency for all transactions
- **Secure Transactions**: Complete transaction lifecycle with status tracking
- **Automatic Commission Distribution**: Commissions automatically paid to agents
- **Balance Management**: User wallets with real-time balance updates
- **Transaction History**: Complete audit trail of all transactions

### 🎮 Hyper-Realistic 3D World
- **Three.js Powered**: High-performance 3D rendering
- **Interactive Properties**: Click on properties to view details
- **Real-time Updates**: Live property and transaction updates via WebSocket
- **Immersive Environment**: Sky, lighting, and environmental effects
- **Smooth Navigation**: Orbit controls for exploring the world

### 👤 User System
- **User Authentication**: Secure JWT-based authentication
- **Avatar System**: Customizable avatars (ready for expansion)
- **User Profiles**: Personal dashboards and statistics
- **Multiple Professions**: Support for various career paths beyond real estate

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ database
- Modern web browser with WebGL support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd meta-the-world
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   
   Create a PostgreSQL database:
   ```bash
   createdb meta_the_world
   ```
   
   Run the schema:
   ```bash
   psql -d meta_the_world -f server/database/schema.sql
   ```

4. **Configure environment variables**
   
   Copy `.env.example` to `.env` and update with your settings:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database credentials and JWT secret.

5. **Start the development servers**
   ```bash
   npm run dev
   ```
   
   This starts both:
   - Backend API server on `http://localhost:5000`
   - Frontend development server on `http://localhost:3000`

6. **Open your browser**
   
   Navigate to `http://localhost:3000` and start exploring!

## 📁 Project Structure

```
meta-the-world/
├── server/                 # Backend API
│   ├── database/          # Database schema and connection
│   ├── middleware/        # Auth middleware
│   ├── routes/           # API routes
│   │   ├── auth.js       # Authentication
│   │   ├── users.js      # User management
│   │   ├── properties.js # Property CRUD
│   │   ├── transactions.js # Transaction handling
│   │   ├── agents.js     # Agent system
│   │   └── world.js      # World stats
│   └── index.js          # Express server
├── src/                   # Frontend React app
│   ├── components/       # React components
│   │   ├── World.jsx     # 3D world view
│   │   ├── Dashboard.jsx # User dashboard
│   │   ├── AgentDashboard.jsx # Agent portal
│   │   └── ...
│   ├── store/            # State management
│   └── App.jsx           # Main app component
└── package.json          # Dependencies
```

## 🎯 How to Use

### As a User

1. **Register/Login**: Create an account or log in
2. **Explore the World**: Navigate the 3D world and view properties
3. **View Properties**: Click on property markers to see details
4. **Purchase Properties**: Initiate transactions from property pages
5. **Manage Your Portfolio**: View your properties in the dashboard

### As a Real Estate Agent

1. **Register as Agent**: Go to the Agent Dashboard and register
2. **List Properties**: Help property owners create listings
3. **Earn Commissions**: Get a percentage of every transaction you facilitate
4. **Track Performance**: Monitor your earnings and transaction history
5. **Build Your Reputation**: Increase your rating through successful deals

## 🔧 Configuration

### Commission Rates

Default agent commission rate is 2.5% (0.025). You can change this in:
- `.env` file: `AGENT_COMMISSION_RATE=0.025`
- Per-listing basis when creating property listings

### Database

The system uses PostgreSQL. Key tables:
- `users`: User accounts
- `properties`: Property/land parcels
- `property_listings`: Active listings
- `transactions`: All transactions
- `agent_commissions`: Commission tracking
- `user_professions`: Agent and other profession data

## 🌟 Future Enhancements

- **VR/AR Support**: Full virtual reality integration
- **Advanced Graphics**: PBR materials, realistic lighting, shadows
- **Social Features**: Multiplayer, chat, events
- **More Professions**: Architect, developer, interior designer, etc.
- **Blockchain Integration**: Full NFT ownership on Ethereum/Polygon
- **Advanced Avatars**: Full body customization, animations
- **Property Building**: Construct buildings on land parcels
- **Market Analytics**: Price trends, market reports
- **Virtual Tours**: 360° property tours
- **AI NPCs**: Non-player characters for richer world

## 🛠️ Technology Stack

- **Backend**: Node.js, Express, PostgreSQL, Socket.io
- **Frontend**: React, Three.js, React Three Fiber
- **Authentication**: JWT
- **Real-time**: WebSocket (Socket.io)
- **3D Rendering**: Three.js with React Three Fiber

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Properties
- `GET /api/properties` - List all properties
- `GET /api/properties/:id` - Get property details
- `POST /api/properties` - Create property
- `POST /api/properties/:id/listings` - Create listing

### Transactions
- `POST /api/transactions` - Create transaction
- `POST /api/transactions/:id/complete` - Complete transaction
- `GET /api/transactions/user/:userId` - Get user transactions

### Agents
- `POST /api/agents/register` - Register as agent
- `GET /api/agents/profile` - Get agent profile
- `GET /api/agents` - List all agents
- `GET /api/agents/commissions` - Get commission history

### World
- `GET /api/world/stats` - Get world statistics
- `GET /api/world/regions` - Get world regions

## 🤝 Contributing

This is a complete virtual world platform. Feel free to extend it with:
- Additional property types
- New professions
- Enhanced graphics
- Social features
- Blockchain integration

## 📄 License

MIT License - Build your virtual reality!

## 🎉 Welcome to Meta The World

A place where you can be what you want to be, or didn't have the chance to be in this life. Start your journey as a virtual real estate agent, build your empire, and make your mark in the metaverse!

---

**Built with ❤️ for the metaverse**
