# 🌍 Meta World - Your Virtual Paradise

> **A hyper-realistic virtual world where you can be anything you want to be. Live the life you always dreamed of, but better.**

Meta World is an immersive browser-based metaverse built with cutting-edge 3D technology. Whether you missed your chance in real life or just want to explore new possibilities, this is your playground to thrive.

## ✨ Features

### 🏢 Real Estate System
- **50+ Properties** - From penthouses to mansions, studios to hotels
- **Dynamic Marketplace** - Buy, sell, and own virtual real estate
- **Property Details** - Each property has unique features, quality ratings, and neighborhoods
- **Visual Indicators** - Properties glow when for sale or selected

### 💼 Career System - Be Who You Want To Be
Choose from 9 different careers, each with unique opportunities:

1. **🏠 Real Estate Agent** - Earn 3% commission on every property sale you facilitate
2. **📐 Architect** - Design stunning buildings
3. **🏗️ Developer** - Build and develop properties
4. **🎨 Artist** - Create and sell virtual art
5. **💼 Entrepreneur** - Start businesses and build your empire
6. **✨ Designer** - Design beautiful interiors
7. **📈 Investor** - Master the market
8. **📹 Content Creator** - Monetize your adventures
9. **🎉 Event Planner** - Organize amazing events

### 💰 Economic System
- **MetaCoins (MC)** - The virtual currency of Meta World
- **Starting Balance** - Begin with 50,000 MC
- **Earn & Spend** - Buy properties, earn commissions, build wealth
- **Transaction History** - Track all your deals

### 🎮 Immersive 3D World
- **Hyper-Realistic Graphics** - Powered by Three.js with advanced rendering
- **Dynamic Lighting** - Real-time shadows and post-processing effects
- **Day/Night Cycles** - Watch time pass with realistic sky changes
- **Weather System** - Experience sunny days, clouds, and changing conditions
- **Procedural Terrain** - Rolling hills and natural landscapes

### 🎭 Avatar & Identity
- **Customizable Appearance** - Skin tone, hair, eyes, clothing
- **Real-time Movement** - WASD controls with sprint
- **Position Tracking** - Always know where you are in the world

### 💬 Social Features
- **Global Chat** - Connect with other residents
- **Real-time Messaging** - Instant communication
- **Beautiful UI** - Sleek chat interface with timestamps

### 📊 Progression System
- **Experience Points** - Gain XP from activities
- **Level Up** - Increase your level and unlock benefits
- **Reputation** - Build your standing in the community
- **Skill System** - Develop skills like negotiation, salesmanship, and more

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start the development server:**
```bash
npm run dev
```

3. **Open your browser:**
Navigate to `http://localhost:3000`

4. **Enter your name and begin your journey!**

## 🎮 How to Play

### Movement Controls
- **W** - Move forward
- **A** - Move left
- **S** - Move backward
- **D** - Move right
- **Shift** - Sprint (2x speed)

### Interactions
- **Click on Buildings** - View property details
- **Properties Button** - Open the real estate marketplace
- **Career Button** - Manage your career and switch professions
- **Chat Icon** - Open global chat

### As a Real Estate Agent

1. **Browse Properties** - Click the "Properties" button in the bottom HUD
2. **Select a Property** - Click any property card or building in the 3D world
3. **Facilitate Sales** - Click "Facilitate Sale" to earn your commission
4. **Earn Commissions** - You'll receive your percentage (3% at level 1)
5. **Level Up** - Gain experience and increase your commission rate

### Building Wealth

- Start with 50,000 MetaCoins
- Purchase properties for personal ownership
- Facilitate sales as an agent to earn commissions
- Level up to increase earning potential
- Watch your net worth grow!

## 🏗️ Technical Stack

### Frontend Framework
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool

### 3D Graphics
- **Three.js** - WebGL 3D library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers and abstractions
- **@react-three/postprocessing** - Visual effects (Bloom, SSAO)

### State Management
- **Zustand** - Lightweight state management

### UI/UX
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

### Procedural Generation
- **Simplex Noise** - Terrain generation

## 📁 Project Structure

```
meta-world/
├── src/
│   ├── components/
│   │   ├── world/           # 3D world components
│   │   │   ├── Ground.tsx   # Terrain with procedural generation
│   │   │   ├── Buildings.tsx # Property buildings
│   │   │   ├── Avatar.tsx   # Player character
│   │   └── Lighting.tsx # Dynamic lighting system
│   │   └── ui/              # UI components
│   │       ├── HUD.tsx      # Heads-up display
│   │       ├── RealEstateUI.tsx # Property marketplace
│   │       ├── CareerUI.tsx     # Career management
│   │       ├── Chat.tsx         # Social chat
│   │       ├── Controls.tsx     # Movement controls
│   │       ├── Notifications.tsx # Toast notifications
│   │       └── Welcome.tsx      # Welcome screen
│   ├── utils/
│   │   └── propertyGenerator.ts # Property data generation
│   ├── types.ts             # TypeScript definitions
│   ├── store.ts             # Global state management
│   ├── World3D.tsx          # Main 3D scene
│   ├── App.tsx              # Root component
│   └── main.tsx             # Entry point
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 🎯 Game Mechanics

### Commission System
As a Real Estate Agent, you earn commissions based on property sales:
- **Base Commission Rate:** 3%
- **Level Progression:** Earn XP to level up
- **Example:** Facilitate a $100,000 property sale = Earn 3,000 MC

### Experience & Leveling
- Earn 1 XP per 1,000 MC in property value
- Level up every 100 XP
- Higher levels = Better commission rates (future feature)
- Increased reputation opens new opportunities

### Property Quality System
- Properties rated 50-100 quality points
- Quality affects property price
- Star rating displayed (1-5 stars)
- Higher quality = Higher value

## 🔮 Future Enhancements

- **Multiplayer Support** - Real-time interaction with other players
- **Property Customization** - Design your own properties
- **More Careers** - Expand career options with unique mechanics
- **Events & Activities** - Parties, auctions, competitions
- **Mobile Support** - Play on tablets and phones
- **VR Support** - Full virtual reality immersion
- **NFT Integration** - True property ownership
- **Economy Simulation** - Dynamic market prices
- **Achievement System** - Unlock rewards and badges
- **Photo Mode** - Capture and share your moments

## 🎨 Visual Features

### Post-Processing Effects
- **Bloom** - Glowing highlights on buildings and objects
- **SSAO** - Screen-space ambient occlusion for depth
- **Dynamic Shadows** - Real-time shadow rendering
- **Fog** - Atmospheric depth and distance

### UI Design
- **Glass Morphism** - Modern frosted glass effects
- **Gradient Backgrounds** - Beautiful color transitions
- **Smooth Animations** - Framer Motion powered
- **Responsive Design** - Works on all screen sizes

### Color Palette
- **For Sale Properties:** Green glow
- **Selected Properties:** Yellow glow
- **Owned Properties:** Blue tint
- **Primary UI:** Purple to Blue gradients
- **Success:** Green
- **Warnings:** Orange/Yellow
- **Errors:** Red

## 🏆 Tips for Success

1. **Start Small** - Buy affordable properties first
2. **Facilitate Sales** - As an agent, you can earn without spending
3. **Level Up Fast** - Focus on high-value transactions
4. **Explore** - Walk around to discover all properties
5. **Diversify** - Own different types of properties
6. **Build Reputation** - Complete transactions to increase standing
7. **Network** - Use the chat to connect with others (future feature)

## 🐛 Known Limitations

- Single player only (multiplayer coming soon)
- Properties are generated randomly at startup
- Camera is currently fixed (player-controlled camera coming soon)
- Weather changes are manual (will be automatic)

## 📝 Development

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome! Feel free to:
- Report bugs
- Suggest features
- Share your Meta World experiences

## 📜 License

This project is open source and available for educational purposes.

## 🌟 Credits

Built with ❤️ using:
- React + Three.js ecosystem
- Modern web technologies
- Inspiration from real metaverse platforms

## 🎮 Start Your New Life Today!

Meta World isn't just a game—it's your chance to live the life you've always wanted. Whether you dreamed of being a successful real estate mogul, a creative architect, or a thriving entrepreneur, your story starts here.

**Your second chance awaits. Welcome to Meta World.** 🌍✨

---

*Made for those who dream of more.*
