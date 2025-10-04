# Meta The World 🌍

**Meta The World** is an innovative AR/VR Metaverse platform with NFT-based land ownership system. Users can own virtual land as NFTs, visualize them in augmented reality based on GPS coordinates, and interact with the metaverse through both web and mobile applications.

## 🚀 Features

- **🏠 NFT Land Ownership**: Own virtual land plots as ERC-721 NFTs on the blockchain
- **📍 GPS-Based AR**: Visualize your virtual land in real-world locations using GPS coordinates
- **🌐 Cross-Platform**: Web application for desktop and mobile AR app for on-the-go interaction
- **🔗 Blockchain Integration**: Smart contracts for land NFT minting and ownership
- **🎮 3D Visualization**: Interactive 3D land visualization using Three.js
- **🗺️ Location Services**: Real-time GPS tracking and geolocation-based features

## 🏗️ Project Structure

```
Meta_The_World/
├── apps/
│   ├── web/          # React web application with 3D visualization
│   ├── mobile/       # React Native AR mobile app
│   └── vr/           # VR application (future development)
├── packages/
│   ├── core/         # Shared types and utilities
│   ├── gps/          # GPS and location services
│   ├── gps-engine/   # GPS tracking engine
│   ├── nft/          # Smart contracts and blockchain logic
│   └── types/        # Generated TypeScript types from smart contracts
├── assets/           # Shared assets and resources
└── scripts/          # Build and deployment scripts
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Three Fiber** - 3D graphics in React
- **Three.js** - 3D visualization and rendering
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server

### Mobile
- **React Native** - Cross-platform mobile development
- **Expo GL** - 3D graphics for mobile
- **Geolocation** - GPS and location services
- **React Native AR** - Augmented reality features

### Blockchain
- **Hardhat** - Ethereum development framework
- **Solidity** - Smart contract development
- **OpenZeppelin** - Secure smart contract libraries
- **Ethers.js** - Ethereum wallet integration

### Development Tools
- **Lerna** - Monorepo management
- **ESLint** - Code linting
- **TypeScript** - Static type checking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YouKnowZo/Meta_The_World.git
   cd Meta_The_World
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the web application**
   ```bash
   cd apps/web
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Compile smart contracts**
   ```bash
   cd packages/nft
   npm run compile
   ```

### Running Applications

#### Web Application
```bash
cd apps/web
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
```

#### Mobile Application
```bash
cd apps/mobile
npm start            # Start Metro bundler
npm run android      # Run on Android (requires Android Studio)
npm run ios          # Run on iOS (requires Xcode - macOS only)
```

#### Smart Contracts
```bash
cd packages/nft
npm run compile      # Compile contracts
npm run test         # Run contract tests
npm run node         # Start local Hardhat node
npm run deploy       # Deploy to local network
```

## 🌐 Web Application Features

- **🔗 Wallet Connection**: Connect MetaMask or other Web3 wallets
- **🏠 Land Visualization**: Interactive 3D view of virtual land plots
- **💰 NFT Minting**: Mint new land NFTs directly from the web interface
- **🗺️ Interactive Map**: Navigate through the virtual world
- **📊 Land Management**: View and manage owned land NFTs

## 📱 Mobile Application Features

- **📍 GPS Integration**: Real-time location tracking
- **🔍 AR Visualization**: Augmented reality view of virtual land
- **🏠 Location-Based Discovery**: Find nearby virtual properties
- **📸 AR Camera**: View virtual land overlaid on real world
- **🗺️ Map Integration**: GPS-based navigation and exploration

## 🔗 Smart Contract Features

### LandNFT Contract
- **Minting**: Create new land NFTs with GPS coordinates
- **Ownership**: Standard ERC-721 ownership functionality
- **Metadata**: Store land information and coordinates
- **Transfers**: Transfer land ownership between users

## 🏗️ Development

### Project Setup
```bash
# Install dependencies for all packages
npm install

# Build all packages
npm run build

# Run development servers for all apps
npm run dev
```

### Package Development
Each package can be developed independently:

```bash
# Core utilities
cd packages/core && npm run dev

# GPS engine
cd packages/gps-engine && npm run dev

# Smart contracts
cd packages/nft && npm run compile
```

## 🚀 Deployment

### Web Application
The web application can be deployed to any static hosting service:

```bash
cd apps/web
npm run build
# Deploy dist/ folder to your hosting service
```

### Smart Contracts
Deploy contracts to various networks:

```bash
cd packages/nft
# Deploy to localhost
npm run deploy

# Deploy to testnet (configure hardhat.config.ts)
npx hardhat ignition deploy ./ignition/modules/LandNFT.ts --network sepolia
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] **Phase 1**: Core platform with basic NFT land ownership ✅
- [ ] **Phase 2**: Enhanced AR features and mobile app optimization
- [ ] **Phase 3**: VR application development
- [ ] **Phase 4**: Multiplayer features and social interactions
- [ ] **Phase 5**: Marketplace for land trading
- [ ] **Phase 6**: Building and development tools for land owners

## 📞 Support

For support, email support@metatheworld.com or join our [Discord community](https://discord.gg/metatheworld).

## 🌟 Acknowledgments

- [OpenZeppelin](https://openzeppelin.com/) for secure smart contract libraries
- [Three.js](https://threejs.org/) for 3D graphics capabilities
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) for React 3D integration
- [Hardhat](https://hardhat.org/) for Ethereum development framework

---

**Built with ❤️ by [YouKnowZo](https://github.com/YouKnowZo)**

*Meta The World - Where Virtual Meets Reality* 🌍✨