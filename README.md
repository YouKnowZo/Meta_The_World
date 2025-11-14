# Meta The World 🌍✨

A hyper-realistic virtual world where you can be anything you want to be. Experience a fully immersive metaverse with virtual real estate, agent systems, and an economy that mirrors and improves upon the real world.

## 🎮 Features

### Core World
- **3D Virtual Environment**: Built with React Three Fiber and Three.js for stunning, realistic graphics
- **Dynamic Terrain**: Procedurally generated landscapes with realistic physics
- **Multiplayer Support**: Real-time interactions with other players via WebSockets
- **Avatar System**: Customize your identity and appearance
- **Free Movement**: Explore the world using WASD controls

### Real Estate System
- **Property Ownership**: Buy, sell, and own virtual properties
- **Property Types**: Land, Residential, Commercial, Luxury, and Estates
- **3D Property Visualization**: View properties in immersive 3D space
- **Property Listings**: List your properties for sale with detailed information
- **Location System**: Properties exist at specific coordinates in the world

### Real Estate Agent System
- **Become an Agent**: Anyone can become a real estate agent
- **Commission Earnings**: Earn 5% (configurable) commission on every property sale you facilitate
- **Agent Dashboard**: Track your sales, commissions, and active listings
- **Agent Analytics**: View your performance metrics and earnings
- **Listing Management**: Manage all your active property listings

### Economic System
- **Virtual Currency (MTC)**: Meta The World Currency for all transactions
- **Starting Balance**: Every new user starts with 10,000 MTC
- **Transaction Processing**: Secure property purchases with automatic fund transfers
- **Commission Tracking**: Automatic commission calculation and distribution
- **Wallet System**: Track your balance and transaction history

### User Features
- **User Dashboard**: View your properties, stats, and wallet balance
- **Property Details**: Comprehensive property information pages
- **Real-time Updates**: Live updates when properties are viewed or purchased
- **Role System**: Users, Agents, and Admins with different capabilities

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```bash
npm run install-all
```

2. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/meta-world
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

3. **Start MongoDB:**
```bash
# If using local MongoDB
mongod
```

4. **Run the application:**
```bash
# Development mode (runs both server and client)
npm run dev

# Or run separately:
npm run server    # Backend on port 5000
npm run client    # Frontend on port 3000
```

5. **Open your browser:**
Navigate to `http://localhost:3000`

## 📁 Project Structure

```
meta-the-world/
├── server/                 # Backend API
│   ├── index.js           # Express server setup
│   ├── models/            # MongoDB models
│   │   ├── User.js
│   │   ├── Property.js
│   │   └── Transaction.js
│   └── routes/            # API routes
│       ├── auth.js
│       ├── users.js
│       ├── properties.js
│       ├── agents.js
│       └── transactions.js
├── client/                 # Frontend React app
│   ├── public/
│   └── src/
│       ├── components/    # React components
│       │   ├── Auth/      # Login/Register
│       │   ├── World/     # 3D world components
│       │   ├── Dashboard/ # User dashboard
│       │   ├── Property/  # Property views
│       │   └── Agent/     # Agent dashboard
│       ├── store/         # State management
│       └── api/           # API client
└── package.json
```

## 🎯 How to Use

### As a User
1. **Register/Login**: Create an account to enter the world
2. **Explore**: Use WASD to move around the 3D world
3. **View Properties**: Click on properties to see details
4. **Purchase**: Buy properties you like (if you have enough MTC)
5. **Manage**: View your properties in the Dashboard

### As a Real Estate Agent
1. **Become an Agent**: Visit the Agent Dashboard and click "Become an Agent"
2. **List Properties**: Help property owners list their properties for sale
3. **Earn Commissions**: Get 5% commission on every sale you facilitate
4. **Track Performance**: Monitor your sales and earnings in the Agent Dashboard
5. **Build Your Business**: Grow your reputation and increase your listings

## 🏗️ Architecture

### Backend
- **Express.js**: RESTful API server
- **MongoDB + Mongoose**: Database and ODM
- **Socket.io**: Real-time multiplayer communication
- **JWT**: Authentication and authorization
- **bcryptjs**: Password hashing

### Frontend
- **React**: UI framework
- **React Three Fiber**: 3D rendering
- **Three.js**: 3D graphics library
- **Socket.io Client**: Real-time updates
- **React Router**: Navigation
- **Zustand**: State management

## 🔐 Security Features
- Password hashing with bcrypt
- JWT token-based authentication
- CORS protection
- Input validation
- Secure API endpoints

## 🎨 Customization

### Adding New Property Types
Edit `server/models/Property.js` to add new property types to the enum.

### Changing Commission Rates
Default commission is 5%. You can set custom rates per property when listing.

### Customizing the World
Modify `client/src/components/World/` components to change terrain, buildings, and world features.

## 🚧 Future Enhancements
- NFT integration for true ownership
- VR/AR support
- More property customization options
- Social features (chat, friends)
- Marketplace for virtual items
- Advanced graphics and shaders
- More property types and regions
- Agent reputation system
- Property auctions

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (admin)
- `POST /api/properties/:id/list` - List property for sale
- `POST /api/properties/:id/purchase` - Purchase property

### Agents
- `GET /api/agents` - Get all agents
- `POST /api/agents/become-agent/:userId` - Become an agent
- `GET /api/agents/:agentId/listings` - Get agent's listings
- `GET /api/agents/:agentId/stats` - Get agent statistics

### Transactions
- `GET /api/transactions` - Get all transactions (with filters)
- `GET /api/transactions/:id` - Get single transaction

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id/avatar` - Update avatar
- `PUT /api/users/:id/position` - Update position

## 🤝 Contributing

This is a complete virtual world platform. Feel free to extend it with:
- New features
- Bug fixes
- Performance improvements
- UI/UX enhancements

## 📄 License

MIT License - Feel free to use this project for your own virtual world!

## 🌟 Vision

Meta The World is designed to be a place where you can:
- **Be what you want to be**: Create your ideal identity
- **Do what you couldn't**: Experience opportunities you missed in real life
- **Build your dreams**: Own property, run businesses, build communities
- **Earn and grow**: Participate in a thriving virtual economy
- **Connect**: Interact with others in a shared virtual space

Welcome to Meta The World - where reality meets possibility! 🚀
