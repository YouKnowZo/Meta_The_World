# Meta The World - Frontend

React + Three.js frontend for the Meta The World metaverse.

## Features

- 🎮 Immersive 3D world with Three.js
- 🥽 VR/AR support via WebXR
- 🌐 Web3 wallet integration
- 🏞️ NFT land visualization
- 🛒 Marketplace UI
- 👤 User profiles

## Tech Stack

- **React 18** - UI framework
- **Three.js** - 3D graphics
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for R3F
- **@react-three/xr** - VR/AR support
- **Vite** - Build tool
- **Material-UI** - Component library
- **Ethers.js** - Ethereum library
- **Zustand** - State management
- **Socket.IO** - Real-time communication

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── World/           # 3D world components
│   │   ├── World.jsx
│   │   ├── Terrain.jsx
│   │   ├── Water.jsx
│   │   ├── Buildings.jsx
│   │   ├── Trees.jsx
│   │   └── PlayerController.jsx
│   ├── UI/              # UI overlay components
│   │   ├── UI.jsx
│   │   └── Sidebar.jsx
│   ├── MetaWorld.jsx    # Main 3D scene
│   ├── LandingPage.jsx
│   ├── Marketplace.jsx
│   └── Profile.jsx
├── store/
│   └── useStore.js      # Global state
├── utils/
│   └── web3.js          # Web3 utilities
├── App.jsx
├── main.jsx
└── index.css
```

## Environment Variables

Create a `.env` file:

```env
VITE_SERVER_URL=http://localhost:3001
VITE_LAND_NFT_CONTRACT_ADDRESS=0x...
VITE_MARKETPLACE_CONTRACT_ADDRESS=0x...
VITE_NETWORK_ID=1337
```

## Controls

### Desktop
- **W/A/S/D** - Move
- **Arrow Keys** - Look around
- **Space** - Jump

### VR/AR
- **Thumbstick** - Move
- **Controllers** - Interact

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for details.

## License

MIT
