# Meta The World 🌍✨

A hyper-realistic metaverse platform where you can be anything you want to be - a virtual reality that's better than the real world. Own virtual real estate, become a real estate agent, and build your dream life in an immersive 3D world.

## 🌟 Features

### Core Experience
- **Hyper-Realistic 3D World**: Built with Three.js and React Three Fiber for stunning visuals
- **Real-Time Multiplayer**: Connect with other users in a shared virtual space
- **Avatar System**: Customize your appearance and express your identity
- **Physics Engine**: Realistic movement and interactions using Cannon.js

### Real Estate System
- **NFT Land Ownership**: Own virtual properties as NFTs
- **Property Marketplace**: Buy and sell properties with transparent pricing
- **Property Types**: Residential, commercial, land, luxury estates, islands, and skyboxes
- **Custom Buildings**: Design and build your own structures

### Real Estate Agent Profession
- **Become an Agent**: Get licensed and start your virtual real estate career
- **Commission System**: Earn a percentage (default 5%) on every transaction you facilitate
- **Transaction Management**: Track all your sales and commissions
- **Agent Dashboard**: Monitor your earnings and performance

### Additional Features
- **Multiple Professions**: Choose from various careers and activities
- **Social Spaces**: Interact with other users
- **Virtual Economy**: Earn and spend virtual currency
- **Modern UI/UX**: Beautiful, intuitive interface

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd meta-the-world
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start MongoDB** (if running locally)
```bash
mongod
```

5. **Run the development servers**
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend client on `http://localhost:5173`

## 📁 Project Structure

```
meta-the-world/
├── server/                 # Backend API
│   ├── index.js           # Express server & Socket.io
│   ├── models/            # MongoDB models
│   │   ├── User.js
│   │   ├── Property.js
│   │   └── Transaction.js
│   └── routes/            # API routes
│       ├── auth.js
│       ├── users.js
│       ├── properties.js
│       ├── transactions.js
│       └── agents.js
├── client/                # Frontend React app
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── 3D/       # Three.js 3D components
│   │   │   ├── panels/   # UI panels
│   │   │   └── hooks/    # Custom hooks
│   │   ├── stores/       # Zustand state management
│   │   └── utils/        # Utilities
│   └── package.json
└── package.json
```

## 🎮 How to Use

### Creating an Account
1. Open the application in your browser
2. Click "Sign up" to create a new account
3. Enter your username, email, password, and optionally a wallet address
4. Click "Create Account" to enter the world

### Becoming a Real Estate Agent
1. Log in to your account
2. Click the briefcase icon in the HUD
3. Enter your license number and desired commission rate
4. Click "Get Licensed"
5. Start facilitating property transactions to earn commissions!

### Buying Property
1. Click the building icon to open the Real Estate Marketplace
2. Browse available listings
3. Click on a property to view details
4. Click "Purchase Property" to buy
5. The property will be transferred to your account

### Selling Property
1. Click the home icon to view your properties
2. Enter a listing price
3. Click "List" to make your property available for sale
4. When sold, you'll receive the sale price (minus agent commission if applicable)

### Navigating the World
- **WASD** or **Arrow Keys**: Move your character
- **Space**: Jump
- **Mouse**: Look around (when using OrbitControls)
- Click on property markers to interact

## 🛠️ Technology Stack

### Frontend
- **React 18**: UI framework
- **Three.js**: 3D graphics engine
- **React Three Fiber**: React renderer for Three.js
- **React Three Drei**: Useful helpers for R3F
- **React Three Cannon**: Physics integration
- **Zustand**: State management
- **Socket.io Client**: Real-time communication
- **Tailwind CSS**: Styling
- **Vite**: Build tool

### Backend
- **Node.js**: Runtime
- **Express**: Web framework
- **Socket.io**: WebSocket server
- **MongoDB**: Database
- **Mongoose**: ODM
- **JWT**: Authentication
- **bcryptjs**: Password hashing

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id/avatar` - Update avatar
- `PUT /api/users/:id/profession` - Change profession
- `POST /api/users/:id/become-agent` - Become real estate agent

### Properties
- `GET /api/properties` - List all properties
- `GET /api/properties/:id` - Get property details
- `POST /api/properties` - Create new property
- `PUT /api/properties/:id/list` - List property for sale
- `PUT /api/properties/:id/unlist` - Remove from marketplace

### Transactions
- `POST /api/transactions/purchase` - Purchase property
- `GET /api/transactions/agent/:agentId` - Get agent transactions

### Agents
- `GET /api/agents` - List all agents
- `GET /api/agents/:id/listings` - Get agent's listings

## 🌐 Real-Time Events (Socket.io)

- `join-world` - Join the virtual world
- `player-move` - Player movement update
- `property-update` - Property state change
- `user-joined` - New user entered
- `user-left` - User disconnected

## 🎨 Customization

### Adding New Property Types
Edit `server/models/Property.js` to add new property types to the enum.

### Adjusting Commission Rates
Default agent commission is 5%. Agents can set custom rates when becoming licensed.

### World Customization
Modify `client/src/components/3D/Terrain.jsx` and `Buildings.jsx` to customize the world appearance.

## 🚧 Future Enhancements

- VR/AR support with WebXR
- Advanced avatar customization
- More professions and activities
- Social features (chat, friends, groups)
- Custom building editor
- Blockchain integration for true NFT ownership
- Virtual events and concerts
- Shopping malls and stores
- Education and learning spaces

## 📝 License

MIT License - feel free to use this project for your own metaverse!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💡 Vision

Meta The World is designed to be a place where you can:
- **Be anything**: Try professions you never had the chance to in real life
- **Own anything**: Build your virtual empire
- **Connect**: Meet people from around the world
- **Create**: Express yourself without limits
- **Earn**: Build a virtual career and income

Welcome to your better reality! 🚀
