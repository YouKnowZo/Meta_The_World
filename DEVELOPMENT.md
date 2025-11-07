# Meta The World - Development Guide

## Project Overview

Meta The World is a full-stack metaverse platform combining:
- **Frontend**: React + Three.js for immersive 3D experiences
- **Backend**: Express.js API for server-side logic
- **Blockchain**: Ethereum smart contracts for NFT land ownership

## Getting Started

### 1. Environment Setup

Copy `.env.example` to `.env` and fill in:
- `VITE_WALLET_CONNECT_PROJECT_ID`: Get from https://cloud.walletconnect.com
- `SEPOLIA_RPC_URL`: Use Infura, Alchemy, or similar
- `PRIVATE_KEY`: For contract deployment (keep secure!)

### 2. Install Dependencies

```bash
# Root
npm install

# Frontend
cd frontend && npm install && cd ..

# Backend  
cd backend && npm install && cd ..

# Contracts
cd contracts && npm install && cd ..
```

### 3. Start Development

**Option A: Run everything separately**
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Local blockchain (optional)
cd contracts && npx hardhat node
```

**Option B: Run from root**
```bash
npm run dev  # Runs frontend and backend concurrently
```

## Architecture Details

### Frontend Structure
```
frontend/src/
├── components/      # Reusable components
│   ├── Navbar.tsx   # Navigation bar
│   └── 3D/          # Three.js components
│       ├── LandGrid.tsx
│       └── UIOverlay.tsx
├── pages/           # Route pages
│   ├── Home.tsx
│   ├── World.tsx
│   ├── Marketplace.tsx
│   └── MyLands.tsx
├── config/          # Configuration
│   └── wagmi.ts     # Web3 config
└── App.tsx          # Main app component
```

### Backend Structure
```
backend/src/
└── index.ts         # Express server
```

### Contracts Structure
```
contracts/
├── contracts/
│   └── MetaTheWorldLand.sol  # Main NFT contract
├── scripts/
│   └── deploy.ts              # Deployment script
└── test/
    └── MetaTheWorldLand.test.ts
```

## Key Features Implementation

### 1. 3D World Rendering
- Uses React Three Fiber for declarative 3D scenes
- Land parcels rendered as interactive boxes
- Click to select and view land details
- Grid system for navigation

### 2. NFT Land Ownership
- ERC-721 standard for unique land tokens
- Each land parcel is a unique NFT
- Coordinates stored on-chain
- Purchase, list, and transfer functionality

### 3. Wallet Integration
- WalletConnect for multi-wallet support
- MetaMask, Coinbase Wallet, etc.
- Automatic network detection
- Transaction signing and approval

### 4. Marketplace
- Browse available land parcels
- View pricing and ownership
- Purchase directly from marketplace
- Filter and search functionality

## Development Tips

### Hot Reload
- Frontend: Vite HMR enabled
- Backend: tsx watch mode
- Contracts: Recompile on changes

### Debugging
- Use browser DevTools for frontend
- Check console for Web3 errors
- Use Hardhat console for contracts
- Backend logs in terminal

### Testing
```bash
# Contracts
cd contracts && npm test

# Frontend (when tests are added)
cd frontend && npm test
```

## Common Issues

### Wallet Connection Fails
- Ensure WalletConnect Project ID is set
- Check network compatibility
- Clear browser cache

### Contract Calls Fail
- Verify contract address in .env
- Check network (localhost vs testnet)
- Ensure sufficient gas

### 3D Scene Not Loading
- Check browser WebGL support
- Verify Three.js dependencies
- Check console for errors

## Next Steps

1. Deploy contracts to testnet
2. Update contract address in .env
3. Test full purchase flow
4. Add AR/VR mode
5. Implement land customization
