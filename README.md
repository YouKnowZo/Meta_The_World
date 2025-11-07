# Meta The World 🌐

**AR/VR Metaverse with NFT Land Ownership**

A cutting-edge metaverse platform built with React, Three.js, WebXR, and Ethereum smart contracts. Own, build, and explore virtual land parcels as NFTs in an immersive 3D world.

## ✨ Features

- **🌍 3D Virtual World** - Explore a vast, immersive 3D metaverse built with Three.js and React Three Fiber
- **🪙 NFT Land Ownership** - Own virtual land parcels as ERC-721 NFTs on the blockchain
- **🥽 AR/VR Ready** - Full WebXR support for augmented and virtual reality experiences
- **🏪 Marketplace** - Buy and sell land parcels in a decentralized marketplace
- **💼 Wallet Integration** - Seamless Web3 wallet connection with WalletConnect
- **🎨 Modern UI** - Beautiful, responsive interface with dark theme

## 🏗️ Architecture

```
meta-the-world/
├── frontend/          # React + Three.js frontend
├── backend/           # Express.js API server
├── contracts/         # Solidity smart contracts
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- MetaMask or compatible Web3 wallet
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd meta-the-world
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

5. **Install contract dependencies**
   ```bash
   cd contracts
   npm install
   cd ..
   ```

6. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your:
   - WalletConnect Project ID (get from [WalletConnect Cloud](https://cloud.walletconnect.com))
   - Sepolia RPC URL (from Infura, Alchemy, etc.)
   - Private key for contract deployment (optional, for testing)

### Running Locally

1. **Start local blockchain** (optional, for testing)
   ```bash
   cd contracts
   npx hardhat node
   ```

2. **Deploy contracts** (in a new terminal)
   ```bash
   cd contracts
   npm run deploy:local
   ```
   Copy the deployed contract address to your `.env` file.

3. **Start backend server**
   ```bash
   cd backend
   npm run dev
   ```

4. **Start frontend**
   ```bash
   cd frontend
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

### Frontend (`/frontend`)
- **React 18** with TypeScript
- **Three.js** + **React Three Fiber** for 3D rendering
- **Wagmi** + **WalletConnect** for Web3 integration
- **Vite** for fast development and building

### Backend (`/backend`)
- **Express.js** REST API
- Blockchain integration with **ethers.js**
- CORS enabled for frontend communication

### Smart Contracts (`/contracts`)
- **Solidity 0.8.20**
- **OpenZeppelin** contracts for security
- **Hardhat** for development and testing
- ERC-721 NFT standard for land ownership

## 🎮 Usage

1. **Connect Wallet**: Click "Connect Wallet" and approve the connection
2. **Explore World**: Navigate to the World page to see the 3D metaverse
3. **Purchase Land**: Click on available land parcels to purchase them
4. **View Marketplace**: Browse and buy land from other users
5. **Manage Lands**: View and manage your owned land parcels

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run ESLint
```

### Backend Development
```bash
cd backend
npm run dev      # Start dev server with hot reload
npm run build    # Build TypeScript
npm start        # Run production build
```

### Smart Contract Development
```bash
cd contracts
npm run compile  # Compile contracts
npm test         # Run tests
npm run deploy:local    # Deploy to local network
npm run deploy:sepolia  # Deploy to Sepolia testnet
```

## 🧪 Testing

### Smart Contracts
```bash
cd contracts
npm test
```

### Frontend
```bash
cd frontend
npm run test
```

## 📦 Building for Production

### Frontend
```bash
cd frontend
npm run build
```
Output will be in `frontend/dist/`

### Backend
```bash
cd backend
npm run build
```
Output will be in `backend/dist/`

## 🌐 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `cd frontend && npm run build`
2. Deploy the `dist` folder to your hosting provider
3. Set environment variables in your hosting dashboard

### Backend (Railway/Render)
1. Deploy the backend folder
2. Set environment variables
3. Ensure the port is configured correctly

### Smart Contracts
1. Deploy to your target network (Sepolia, Mainnet, etc.)
2. Update contract address in frontend `.env`
3. Verify contracts on Etherscan

## 🔐 Security

- Smart contracts use OpenZeppelin's battle-tested libraries
- ReentrancyGuard protection
- Input validation on all functions
- Access control with Ownable pattern

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Three.js, React Three Fiber, Wagmi, Vite
- **Backend**: Node.js, Express, TypeScript
- **Blockchain**: Solidity, Hardhat, Ethers.js
- **Web3**: WalletConnect, MetaMask
- **Styling**: CSS3 with CSS Variables

## 🎯 Roadmap

- [ ] AR/VR mode with WebXR
- [ ] Land customization and building tools
- [ ] Multiplayer support
- [ ] Land rental system
- [ ] Governance token
- [ ] Mobile app
- [ ] Social features

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ for the metaverse
