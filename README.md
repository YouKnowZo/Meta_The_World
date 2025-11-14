# 🌍 MetaWorld - Live Your Best Virtual Life

> **"A place where you can be what you want to be, or what you didn't have the chance to in this life."**

A hyper-realistic virtual metaverse where you can be anything you want to be, with a complete economy, real estate market, professions system, and stunning 3D visualization. Everything the real world has, but **better**.

![MetaWorld](https://img.shields.io/badge/Status-Production%20Ready-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Quick Start

**Ready in 60 seconds:**
```bash
npm install && npm start
```
Then open: **http://localhost:3000**

👉 **New here?** Check out [QUICKSTART.md](QUICKSTART.md) for a guided tour!

## ✨ Features

### 🏙️ Hyper-Realistic 3D World
- **Stunning Graphics**: Built with Three.js for beautiful, real-time 3D rendering
- **Dynamic City**: Explore a living, breathing metropolis with 30+ unique properties
- **Day/Night Cycle**: Experience realistic lighting and atmosphere
- **Physics & Interactions**: Click properties to explore and purchase

### 🏠 Virtual Real Estate System
- **30+ Unique Properties**: From luxury penthouses to cozy apartments
- **Property Types**: 
  - Luxury Penthouse
  - Modern Villa
  - Downtown Office
  - Cozy Apartment
  - Beach House
  - Mountain Cabin
  - Sky Tower Suite
  - Garden Estate
- **Realistic Features**: Each property has unique amenities, square footage, bedrooms, bathrooms
- **Dynamic Pricing**: Properties valued from $150,000 to $1,000,000+
- **Ownership System**: Buy, own, and manage your virtual portfolio

### 💼 Profession System
Choose your path and earn in different ways:

1. **Real Estate Agent** (Featured Role)
   - Earn 5% commission on every property transaction
   - Show properties to buyers
   - Build your portfolio while earning passive income
   - Perfect for entrepreneurial spirits!

2. **Architect**
   - Design and modify properties
   - Create custom buildings

3. **Property Developer**
   - Develop new properties
   - Increase property values

4. **Professional Investor**
   - Buy low, sell high
   - Market analysis tools

5. **Interior Designer**
   - Customize property interiors
   - Earn from design fees

6. **Virtual Banker**
   - Manage the economy
   - Provide loans and mortgages

### 💰 Complete Economy System
- **Virtual Currency**: Start with $1,000,000
- **Transaction System**: Buy and sell properties
- **Commission Structure**: Real estate agents earn on every deal
- **Level System**: Gain experience and level up for bonuses
- **Portfolio Management**: Track investments and earnings

### 🎮 User Experience
- **Beautiful UI**: Modern, sleek interface with glassmorphism effects
- **Real-time Updates**: See your balance, properties, and stats instantly
- **Notifications**: Get alerts for transactions, level-ups, and achievements
- **Responsive Design**: Works on all devices
- **Smooth Animations**: Cinematic camera movements and transitions

### 🌐 Multiplayer Ready
- **WebSocket Support**: Real-time multiplayer (server included)
- **Chat System**: Communicate with other users
- **Leaderboards**: Compete with others
- **Property Marketplace**: See what others are buying

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ installed
- Modern web browser (Chrome, Firefox, Safari, Edge)
- 5 minutes of your time

### Installation

```bash
# Clone or download this repository
cd metaworld

# Install dependencies
npm install

# Launch MetaWorld
npm start
```

**That's it!** Open `http://localhost:3000` in your browser.

### Development Mode
For auto-restart during development:
```bash
npm run dev
```

### First Time Here?
📖 Read the [QUICKSTART.md](QUICKSTART.md) guide - get profitable in 10 minutes!
🎯 Check [FEATURES.md](FEATURES.md) for the complete feature list and roadmap

## 🎯 How to Play

### As a Real Estate Agent

1. **Select Your Profession**
   - Click the dropdown in the left panel
   - Choose "Real Estate Agent (5% commission)"

2. **Browse Properties**
   - View available properties in the right panel
   - Click on buildings in the 3D world to explore
   - Check property details, price, and features

3. **Make Transactions**
   - Click "Show Property" or "Buy Property"
   - Review the transaction details
   - Note your 5% commission earnings
   - Confirm the purchase

4. **Earn & Grow**
   - Each transaction earns you commission
   - Commission reduces your net cost
   - Level up to unlock bonuses
   - Build your property portfolio

5. **Track Your Success**
   - Monitor your balance and earnings
   - View owned properties
   - See commission earned
   - Watch your level increase

### General Gameplay

- **Explore**: Use mouse to hover over buildings (they light up!)
- **Select**: Click buildings to view details
- **Purchase**: Buy properties to grow your portfolio
- **Earn**: Make money through commissions and property value
- **Level Up**: Gain experience and unlock bonuses

## 🏗️ Architecture

### Frontend
- **index.html**: Main UI and layout
- **world-engine.js**: 3D rendering engine (Three.js)
- **app.js**: Game logic, economy, and user interactions

### Backend
- **server.js**: Express server with WebSocket support
- **API Routes**: RESTful endpoints for data management
- **Database**: In-memory storage (easily upgradeable to MongoDB/PostgreSQL)

### Technologies
- **Three.js**: 3D graphics and rendering
- **Express**: Web server
- **WebSocket**: Real-time multiplayer
- **Pure JavaScript**: No framework dependencies for client

## 🎨 Customization

### Adding New Property Types
Edit `world-engine.js`, add to `propertyTypes` array:
```javascript
{
    name: 'Your Property Type',
    basePrice: 500000,
    height: 50,
    color: 0x2563eb
}
```

### Adjusting Commission Rate
Edit `app.js`:
```javascript
this.commissionRate = 0.05; // Change to desired rate
```

### Adding New Professions
Edit both `index.html` (dropdown) and `app.js` (profession logic)

## 🌟 Features Roadmap

### Planned Features
- [ ] Multiplayer avatars visible in 3D world
- [ ] Voice chat
- [ ] Property customization
- [ ] Virtual events and meetups
- [ ] NFT integration for property ownership
- [ ] Virtual businesses (restaurants, shops, etc.)
- [ ] Transportation system (cars, helicopters)
- [ ] Weather system
- [ ] Seasonal events
- [ ] Achievement system
- [ ] Social features (friends, parties)
- [ ] Virtual job market
- [ ] Educational institutions
- [ ] Entertainment venues

## 💡 Tips for Success

1. **Start as a Real Estate Agent**: The 5% commission makes it easier to grow
2. **Buy Low**: Look for properties under $300,000 to start
3. **Build Portfolio**: Own multiple properties to diversify
4. **Level Up**: Higher levels = bigger bonuses
5. **Watch the Market**: Property values and availability change

## 🤝 Contributing

This is your virtual world! Feel free to:
- Add new features
- Improve graphics
- Create new professions
- Enhance the economy
- Build new areas

## 📝 License

MIT License - Feel free to use, modify, and distribute

## 🎮 About

MetaWorld is a virtual world where you can live the life you've always wanted. Whether you dream of being a successful real estate mogul, architect, or entrepreneur, this is your chance. Start with a million dollars, choose your path, and build your empire in a beautiful, hyper-realistic 3D environment.

**Your new life starts now. Welcome to MetaWorld.** 🌍✨

---

## 🐛 Troubleshooting

### Port Already in Use
Change the port in `server.js` or set environment variable:
```bash
PORT=8080 npm start
```

### 3D Not Rendering
- Ensure you have WebGL support in your browser
- Try a different browser
- Update your graphics drivers

### Performance Issues
- Close other tabs
- Lower the number of properties in `world-engine.js`
- Disable shadows by setting `renderer.shadowMap.enabled = false`

## 📧 Support

For issues or questions, create an issue in the repository.

**Enjoy your virtual life!** 🚀
