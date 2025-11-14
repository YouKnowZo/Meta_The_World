# Meta The World 🌍

A hyper-realistic virtual world where you can be anything you want to be. Experience everything the real world has to offer, but better. Build your dream life, pursue any career, and create your own destiny.

## ✨ Features

### 🌍 Infinite Possibilities
- **Hyper-Realistic 3D World**: Built with Three.js for stunning graphics and immersive experiences
- **Dynamic Environment**: Realistic lighting, shadows, terrain, water, and nature
- **Beautiful UI**: Modern, responsive interface with smooth animations

### 🏠 Real Estate Empire
- **Virtual Real Estate Agent**: Become a real estate agent and earn commissions on every transaction
- **Property System**: Buy, sell, and list properties in the virtual world
- **Commission Tracking**: Automatic 3% commission on all agent-facilitated sales
- **Property Management**: Create listings, track sales, and build your real estate portfolio

### 💰 Economic System
- **Virtual Currency (META)**: Start with 10,000 META to begin your journey
- **Transaction System**: Secure property purchases and sales
- **Earnings Tracking**: Monitor your income as a real estate agent

### 👤 Identity & Roles
- **Multiple Roles**: Choose to be a Citizen, Real Estate Agent, Developer, Investor, or Artist
- **Custom Avatars**: Express yourself with role-based avatars
- **Career Paths**: Switch roles and explore different opportunities

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd meta-the-world
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## 🎮 How to Use

### Getting Started
1. **Login**: Enter your name and choose your role
2. **Explore**: Navigate the 3D world using mouse controls
3. **Interact**: Click on properties to view details and purchase

### Becoming a Real Estate Agent
1. Select "Real Estate Agent" as your role during login
2. Access the Agent Dashboard from the control panel
3. Create listings for available properties
4. Earn 3% commission on every sale you facilitate

### Property System
- **View Properties**: Click on any property in the world to see details
- **Purchase**: Buy properties directly or through an agent
- **List Properties**: As an agent, list properties to earn commissions
- **Track Sales**: Monitor your transactions and earnings

### Controls
- **Mouse Drag**: Rotate camera
- **Scroll**: Zoom in/out
- **Right Click + Drag**: Pan camera
- **Click Properties**: Select and view property details

## 🏗️ Architecture

### Tech Stack
- **React 18**: Modern UI framework
- **Three.js**: 3D graphics and world rendering
- **Zustand**: State management
- **Webpack**: Module bundling
- **Express**: Development server

### Project Structure
```
meta-the-world/
├── src/
│   ├── components/       # React components
│   │   ├── LoginScreen.js
│   │   ├── WorldView.js
│   │   ├── PropertyPanel.js
│   │   ├── RealEstateAgentPanel.js
│   │   └── UserHUD.js
│   ├── engine/           # 3D world engine
│   │   └── WorldEngine.js
│   ├── stores/           # State management
│   │   ├── userStore.js
│   │   └── realEstateStore.js
│   ├── styles/           # Global styles
│   ├── App.js
│   └── index.js
├── public/               # Static assets
├── server.js            # Express server
└── package.json
```

## 🎯 Key Features Explained

### Real Estate Agent System
- **Commission Rate**: 3% of sale price on every transaction
- **Listing Management**: Create and manage property listings
- **Transaction History**: Track all your sales and earnings
- **Dashboard**: Real-time stats on your real estate business

### Property System
- **Property Types**: Residential and Commercial
- **Features**: Each property has unique features and characteristics
- **Ownership**: Buy and own properties in the virtual world
- **Status Tracking**: Properties can be for-sale, listed, or owned

### World Engine
- **Realistic Rendering**: High-quality graphics with shadows and lighting
- **Dynamic Environment**: Terrain, trees, water, and natural features
- **Property Visualization**: 3D models for all properties
- **Interactive Elements**: Click to select and view properties

## 🔮 Future Enhancements

- Multiplayer support with real-time interactions
- VR/AR compatibility
- More property types and customization options
- Social features and communities
- Advanced economic systems
- NFT integration for property ownership
- More career paths and opportunities
- Custom avatar creation
- Building and development tools

## 📝 License

MIT License - Feel free to use and modify as needed.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

---

**Meta The World** - Where you can be who you want to be, and live the life you've always dreamed of. 🌟
