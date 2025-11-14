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

### Dating & Social System
- **Dating Profiles**: Create your profile with bio, interests, and photos
- **Swipe & Match**: Discover and match with other users
- **Social Connections**: Build friendships and relationships
- **Match System**: Get notified when someone likes you back

### Car System
- **Car Ownership**: Buy and own multiple vehicles
- **Customization**: Customize colors, wheels, spoilers, neon lights, and more
- **Car Dealerships**: Browse and purchase from various car models
- **Performance Stats**: Speed, acceleration, handling, and fuel management

### Shopping & Stores
- **Food Stores**: Buy food to restore hunger and energy
- **Clothing Stores**: Purchase outfits and accessories
- **Pet Stores**: Buy pet food, toys, and accessories
- **Restaurants**: Dine out and socialize
- **Gas Stations**: Refuel your vehicles
- **Inventory System**: Manage all your purchased items

### Pet System
- **Adopt Pets**: Choose from dogs, cats, birds, fish, reptiles, and exotic pets
- **Pet Care**: Feed, play, and care for your pets
- **Pet Stats**: Track happiness, hunger, and energy levels
- **Pet Customization**: Name, breed, and color your pets

### City System
- **Multiple Cities**: Explore different themed cities (modern, tropical, futuristic)
- **City Necessities**: Every city has balanced stores and services
- **City Markers**: Visual indicators for cities in the 3D world
- **Store Distribution**: Automatic store placement based on city needs

### Additional Features
- **Multiple Professions**: Choose from various careers and activities
- **Virtual Economy**: Earn and spend virtual currency
- **Inventory Management**: Track all your items and equipment
- **Stats System**: Hunger, energy, happiness, and experience tracking
- **Modern UI/UX**: Beautiful, intuitive interface

## 💰 Cryptocurrency & Starting Balance

### Automatic Virtual Currency
- **New users automatically receive 10,000 virtual currency** on registration
- No wallet needed - instant access to the economy
- Use for: Food, clothes, pets, cars, properties

### Cryptocurrency Integration (Optional)
- **Supported Chains**: Polygon (recommended), Ethereum, BSC, Arbitrum, Optimism
- **Connect Wallet**: MetaMask integration for real crypto
- **Free Faucet**: Claim 10 MATIC (Polygon) or 0.01 ETH (Ethereum) + 5,000 bonus virtual currency
- **One claim per wallet** - Get your starting balance instantly!

See [CRYPTO_SETUP.md](./CRYPTO_SETUP.md) for detailed setup instructions.

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

### Cities
- `GET /api/cities` - List all cities
- `GET /api/cities/:id` - Get city details with stores
- `POST /api/cities` - Create new city

### Cars
- `GET /api/cars/models` - Get available car models
- `GET /api/cars/my-cars` - Get user's cars
- `POST /api/cars/purchase` - Purchase a car
- `PUT /api/cars/:id/customize` - Customize car
- `PUT /api/cars/:id/position` - Update car position

### Stores
- `GET /api/stores` - List stores (filter by cityId, storeType)
- `GET /api/stores/:id/products` - Get store products
- `POST /api/stores/:storeId/purchase` - Purchase product

### Dating
- `GET /api/dating/profile` - Get user's dating profile
- `PUT /api/dating/profile` - Update dating profile
- `GET /api/dating/discover` - Discover potential matches
- `POST /api/dating/like/:userId` - Like a user
- `POST /api/dating/dislike/:userId` - Dislike a user
- `GET /api/dating/matches` - Get matches

### Pets
- `GET /api/pets/my-pets` - Get user's pets
- `POST /api/pets/adopt` - Adopt a pet
- `PUT /api/pets/:id/feed` - Feed pet
- `PUT /api/pets/:id/play` - Play with pet
- `PUT /api/pets/:id/position` - Update pet position

### Inventory
- `GET /api/inventory/my-inventory` - Get user's inventory
- `PUT /api/inventory/equip/:itemId` - Equip/unequip item

### Cryptocurrency
- `POST /api/crypto/connect` - Connect MetaMask wallet
- `GET /api/crypto/wallet` - Get wallet info and balances
- `POST /api/crypto/faucet/claim` - Claim free starting balance
- `GET /api/crypto/networks` - Get supported blockchain networks

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

## 🎮 Complete Feature List

✅ **Implemented Features:**
- 3D Virtual World with Physics
- Real Estate System with NFT Ownership
- Real Estate Agent Profession with Commissions
- Dating & Social Matching System
- Car Ownership & Customization
- Shopping System (Food, Clothing, Pet Stores)
- Pet Adoption & Care System
- City System with Balanced Necessities
- Inventory Management
- User Stats (Hunger, Energy, Happiness)
- Real-time Multiplayer
- Modern UI/UX

## 🚧 Future Enhancements

- VR/AR support with WebXR
- Advanced avatar customization
- More professions and activities
- In-game chat and messaging
- Custom building editor
- Blockchain integration for true NFT ownership
- Virtual events and concerts
- Education and learning spaces
- Mini-games and activities
- Job system with salaries
- Vehicle racing and competitions

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
