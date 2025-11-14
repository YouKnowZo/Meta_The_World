# Meta The World

A hyper-realistic virtual world where you can be anything you want to be. Experience a fully immersive 3D metaverse with a complete real estate system, where you can buy, sell, and trade virtual properties. Become a real estate agent and earn commissions on every transaction you facilitate.

## 🌟 Features

### Virtual World
- **3D Immersive Environment**: Explore a beautiful 3D world built with Three.js and React Three Fiber
- **Realistic Graphics**: Hyper-realistic rendering with dynamic lighting, shadows, and environmental effects
- **Interactive Navigation**: Fly through the world, zoom, and explore properties in real-time

### Real Estate System
- **Property Creation**: Create and customize your own virtual properties
- **Property Trading**: Buy and sell properties with a complete transaction system
- **Property Listings**: List properties for sale with custom pricing
- **Property Types**: Residential, Commercial, Land, and Luxury properties

### Real Estate Agent System
- **Agent Role**: Register as a real estate agent to facilitate transactions
- **Commission System**: Earn 5% commission on every property transaction you facilitate
- **Agent Dashboard**: Track your earnings, transactions, and active listings
- **Transaction Management**: View all your completed transactions and commissions

### User Features
- **User Accounts**: Secure authentication system with JWT tokens
- **Wallet System**: Virtual currency system for all transactions
- **Dashboard**: Track your spending, earnings, and property portfolio
- **Transaction History**: Complete history of all your property transactions

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

2. **Set up environment variables:**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   JWT_SECRET=your-secret-key-change-in-production
   ```

   Create a `.env` file in the `client` directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

3. **Start the development servers:**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend React app on `http://localhost:3000`

### Manual Setup

If you prefer to run servers separately:

**Backend:**
```bash
cd server
npm install
npm start
```

**Frontend:**
```bash
cd client
npm install
npm start
```

## 📖 Usage

### Creating an Account

1. Navigate to the login page
2. Click "Sign up" to create a new account
3. Choose your role:
   - **User**: Standard user who can buy and sell properties
   - **Real Estate Agent**: Can facilitate transactions and earn commissions

### Creating Properties

1. Navigate to "Properties" from the sidebar
2. Click "Create Property"
3. Fill in the property details:
   - Title
   - Description
   - Price
   - Size
   - Property Type
4. The property will appear in the 3D world at a random location

### Listing Properties for Sale

1. Go to "Properties" section
2. Find a property you own (status: "available")
3. Click "List for Sale"
4. Set your listing price
5. If you're an agent, you'll automatically be assigned as the listing agent

### Buying Properties

1. Browse available properties in the "Properties" section
2. Click "Buy Property" on any listed property
3. Confirm the purchase
4. The property will be transferred to your account
5. If an agent listed the property, they'll receive a 5% commission

### Real Estate Agent Features

1. **Register as an Agent**: Sign up with the "Real Estate Agent" role
2. **List Properties**: List any property (yours or others) to earn commissions
3. **Track Earnings**: View your total commissions and transaction history in the Agent Dashboard
4. **Monitor Listings**: See all your active listings and potential earnings

## 🏗️ Architecture

### Backend (`/server`)
- **Express.js** REST API
- **SQLite** database for data persistence
- **JWT** authentication
- **bcrypt** for password hashing

### Frontend (`/client`)
- **React** for UI components
- **Three.js** and **React Three Fiber** for 3D rendering
- **React Router** for navigation
- **Zustand** for state management
- **Axios** for API calls
- **Framer Motion** for animations

## 📁 Project Structure

```
meta-the-world/
├── server/
│   ├── index.js          # Express server and API routes
│   ├── package.json
│   └── database.sqlite   # SQLite database (created on first run)
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── store/        # State management
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── package.json
└── README.md
```

## 🎮 Controls

- **Mouse Drag**: Rotate the camera around the world
- **Scroll Wheel**: Zoom in/out
- **Right Click + Drag**: Pan the camera
- **Click Property Markers**: Select and view property details

## 💰 Economy

- **Starting Balance**: New users start with $10,000
- **Commission Rate**: 5% of transaction value for agents
- **Transaction Fees**: None (pure peer-to-peer trading)

## 🔒 Security

- Passwords are hashed using bcrypt
- JWT tokens for secure authentication
- SQL injection protection via parameterized queries
- CORS enabled for API access

## 🚧 Future Enhancements

- Avatar customization system
- VR/AR support
- Social features (chat, friends)
- Property customization tools
- Advanced 3D property previews
- NFT integration for property ownership
- Marketplace for property auctions
- Property rental system

## 📝 License

MIT License - Feel free to use this project for your own virtual world!

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

---

**Built with ❤️ for the metaverse**
