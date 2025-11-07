# 🌍 Meta The World

**The Next Generation AR/VR Metaverse with NFT Land Ownership**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?logo=ethereum&logoColor=white)](https://ethereum.org/)

Meta The World is a cutting-edge metaverse platform that combines immersive 3D environments, blockchain technology, and social networking to create a truly decentralized virtual world where users can own land as NFTs, build experiences, and interact with others in real-time.

![Meta The World](https://via.placeholder.com/1200x400/667eea/ffffff?text=Meta+The+World+Metaverse)

## ✨ Features

### 🎮 Immersive 3D World
- **Stunning Graphics**: Built with Three.js and React Three Fiber for smooth, beautiful 3D rendering
- **Dynamic Terrain**: Procedurally generated landscapes with varied biomes
- **Realistic Environment**: Day/night cycles, weather effects, and atmospheric lighting
- **Interactive Objects**: Buildings, trees, water, and customizable structures

### 🥽 VR/AR Support
- **WebXR Integration**: Native support for VR headsets (Oculus, HTC Vive, etc.)
- **AR Mode**: Experience the metaverse in augmented reality
- **Hand Tracking**: Natural interactions with hand controllers
- **Immersive Controls**: Full 6DOF movement in VR/AR mode

### 🏞️ NFT Land Ownership
- **ERC-721 Land Parcels**: Own unique pieces of the metaverse as NFTs
- **Verifiable Ownership**: Blockchain-verified land ownership
- **Coordinate System**: 3D coordinate-based land allocation
- **Batch Minting**: Purchase multiple adjacent parcels at once
- **Customizable Metadata**: Add custom attributes to your land

### 🛒 Decentralized Marketplace
- **Buy & Sell Land**: Trade land parcels with other users
- **Price Discovery**: Market-driven land valuation
- **Smart Contract Escrow**: Secure, trustless transactions
- **Marketplace Fees**: Minimal fees to sustain the ecosystem
- **Listing Management**: Easy-to-use interface for managing your listings

### 👥 Multiplayer & Social
- **Real-time Multiplayer**: See and interact with other users in real-time
- **WebSocket Technology**: Low-latency player synchronization
- **Voice Chat**: Communicate with nearby players (coming soon)
- **Social Features**: Friend lists, messaging, and groups
- **Events & Gatherings**: Host and attend virtual events

### 🎨 Avatar Customization
- **Unique Avatars**: Create and customize your virtual identity
- **Appearance Options**: Various styles, colors, and accessories
- **NFT Wearables**: Show off your NFT collections as avatar items (coming soon)

## 🏗️ Architecture

```
meta-the-world/
├── client/              # React + Three.js frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── store/       # State management (Zustand)
│   │   └── utils/       # Utility functions
│   └── package.json
├── server/              # Node.js + Express + Socket.IO backend
│   ├── src/
│   │   ├── models/      # MongoDB models
│   │   ├── routes/      # API routes
│   │   └── index.js     # Server entry point
│   └── package.json
├── contracts/           # Solidity smart contracts
│   ├── contracts/       # Smart contract source
│   ├── scripts/         # Deployment scripts
│   ├── test/           # Contract tests
│   └── hardhat.config.js
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MetaMask or another Web3 wallet
- MongoDB (optional, for backend features)
- Git

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

4. **Deploy smart contracts (optional)**
```bash
cd contracts
npx hardhat compile
npx hardhat node  # In one terminal
npx hardhat run scripts/deploy.js --network localhost  # In another terminal
```

5. **Start the development servers**
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## 📖 Detailed Documentation

### Smart Contracts

#### MetaWorldLand.sol
The main NFT contract for land ownership. Features:
- ERC-721 compliant
- 3D coordinate-based land allocation
- Batch minting support
- Metadata management
- Ownership verification

#### MetaWorldMarketplace.sol
Decentralized marketplace for trading land. Features:
- List lands for sale
- Buy listed lands
- Update listing prices
- Cancel listings
- Marketplace fee system

### API Endpoints

#### Authentication
- `POST /api/auth/verify` - Verify wallet signature and get JWT
- `GET /api/auth/verify-token` - Verify JWT token

#### Lands
- `GET /api/lands` - Get all lands (with filters)
- `GET /api/lands/:tokenId` - Get land by token ID
- `POST /api/lands` - Create/update land
- `PUT /api/lands/:tokenId` - Update land metadata

#### Marketplace
- `GET /api/marketplace` - Get all listings (with filters)
- `GET /api/marketplace/:tokenId` - Get listing by token ID
- `POST /api/marketplace` - Create listing
- `PUT /api/marketplace/:tokenId` - Update listing price
- `DELETE /api/marketplace/:tokenId` - Cancel listing

### WebSocket Events

#### Client to Server
- `positionUpdate` - Send player position
- `chatMessage` - Send chat message

#### Server to Client
- `playersInit` - Initial player list
- `playerJoined` - New player joined
- `playerUpdate` - Player position update
- `playerDisconnected` - Player disconnected
- `chatMessage` - Broadcast chat message

## 🎮 Controls

### Desktop
- **W/A/S/D** - Move forward/left/backward/right
- **Arrow Keys** - Look around
- **Space** - Jump
- **Mouse** - Look around (when clicked)

### VR/AR
- **Thumbstick** - Move
- **Hand Controllers** - Interact with objects
- **Grip** - Teleport

## 🧪 Testing

### Smart Contract Tests
```bash
cd contracts
npx hardhat test
```

### Frontend Tests
```bash
cd client
npm test
```

### Backend Tests
```bash
cd server
npm test
```

## 📦 Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy the dist/ directory
```

### Backend (Heroku/Railway/DigitalOcean)
```bash
cd server
npm start
```

### Smart Contracts (Ethereum Mainnet)
```bash
cd contracts
npx hardhat run scripts/deploy.js --network mainnet
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🔧 Configuration

### Environment Variables

#### Client (.env)
```env
VITE_SERVER_URL=http://localhost:3001
VITE_LAND_NFT_CONTRACT_ADDRESS=0x...
VITE_MARKETPLACE_CONTRACT_ADDRESS=0x...
```

#### Server (.env)
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/meta-the-world
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

#### Contracts (.env)
```env
PRIVATE_KEY=your-wallet-private-key
INFURA_API_KEY=your-infura-api-key
ETHERSCAN_API_KEY=your-etherscan-api-key
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) - 3D graphics library
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) - React renderer for Three.js
- [Ethers.js](https://docs.ethers.org/) - Ethereum library
- [OpenZeppelin](https://openzeppelin.com/) - Smart contract library
- [Socket.IO](https://socket.io/) - Real-time communication
- [Material-UI](https://mui.com/) - React UI framework

## 📞 Support

- 📧 Email: support@metaworld.com
- 💬 Discord: [Join our community](https://discord.gg/metaworld)
- 🐦 Twitter: [@MetaTheWorld](https://twitter.com/metaworld)
- 📖 Documentation: [docs.metaworld.com](https://docs.metaworld.com)

## 🗺️ Roadmap

- [x] Basic 3D world with terrain
- [x] NFT land ownership system
- [x] Marketplace for trading land
- [x] Multiplayer support
- [x] VR/AR support with WebXR
- [ ] Voice chat
- [ ] Mobile app (iOS/Android)
- [ ] Building tools and customization
- [ ] Economy system with token
- [ ] DAO governance
- [ ] Cross-chain support
- [ ] Avatar NFTs and wearables
- [ ] Virtual events and concerts
- [ ] In-world game creation tools

---

Made with ❤️ by the Meta The World Team
