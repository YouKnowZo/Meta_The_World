# Meta The World

A hyper-realistic virtual world metaverse with virtual real estate and agent functionality. Experience a world where you can be anything you want to be, including a virtual real estate agent earning commissions on every transaction.

## Features

### 🌍 Immersive 3D World
- Realistic 3D environment built with Three.js and React Three Fiber
- Interactive avatars with real-time multiplayer support
- Beautiful terrain, buildings, and environments
- Property markers visible in the world

### 🏠 Virtual Real Estate
- Buy and sell virtual properties
- Multiple property types: Residential, Commercial, Luxury, Penthouse, Mansion, Land
- NFT-based property ownership system
- Detailed property listings with descriptions, features, and pricing
- Property marketplace with advanced filtering

### 💼 Real Estate Agent System
- Become a licensed virtual real estate agent
- Set your own commission rate (1-20%)
- Earn commissions on every property transaction you facilitate
- Track your earnings and sales statistics
- Agent dashboard with comprehensive analytics

### 💰 Virtual Economy
- Virtual currency system
- Transaction tracking
- Commission payments
- Property ownership management

### 👤 User Features
- User registration and authentication
- Customizable avatars
- Personal dashboard
- Property ownership tracking
- Transaction history

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Socket.io for real-time communication
- JWT authentication
- RESTful API

### Frontend
- React 18
- React Router for navigation
- Three.js & React Three Fiber for 3D graphics
- Zustand for state management
- Axios for API calls
- Socket.io Client for real-time updates

## Installation

1. **Install dependencies:**
   ```bash
   npm run install-all
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/meta-the-world
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

3. **Start MongoDB:**
   Make sure MongoDB is running on your system.

4. **Run the application:**
   ```bash
   npm run dev
   ```
   This will start both the backend server (port 5000) and frontend client (port 3000).

## Usage

1. **Register/Login:** Create an account or login to enter the world
2. **Explore:** Navigate the 3D world using WASD keys
3. **Browse Properties:** Visit the marketplace to see available properties
4. **Purchase Properties:** Buy properties with your virtual currency
5. **Become an Agent:** Register as a real estate agent to earn commissions
6. **List Properties:** List your properties for sale and assign agents
7. **Earn Commissions:** As an agent, earn a percentage of every sale

## Project Structure

```
meta-the-world/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Auth/       # Authentication components
│   │   │   ├── World/      # 3D world components
│   │   │   ├── Marketplace/# Property marketplace
│   │   │   ├── Agent/      # Agent dashboard
│   │   │   ├── Dashboard/  # User dashboard
│   │   │   └── UI/         # UI components
│   │   ├── store/          # State management
│   │   └── App.js          # Main app component
│   └── public/
├── server/                 # Node.js backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── index.js           # Server entry point
└── package.json           # Root package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/become-agent` - Become a real estate agent

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property
- `POST /api/properties/:id/list` - List property for sale
- `PUT /api/properties/:id` - Update property

### Agents
- `GET /api/agents` - Get all agents
- `GET /api/agents/:id/stats` - Get agent statistics
- `GET /api/agents/:id/listings` - Get agent's listings

### Transactions
- `POST /api/transactions/purchase` - Purchase a property
- `GET /api/transactions/my-transactions` - Get user's transactions

## Future Enhancements

- VR/AR support for immersive experience
- More property customization options
- Social features and chat
- Property interior viewing
- Advanced graphics and shaders
- Blockchain integration for true NFT ownership
- More districts and world expansion
- Property development and construction
- Rental income system

## License

MIT
