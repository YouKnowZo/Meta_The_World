# Meta The World 🌍

A hyper-realistic virtual world metaverse where you can be anything you want to be and own virtual real estate. Built with cutting-edge 3D graphics, real-time transactions, and a complete real estate agent system.

## ✨ Features

### 🏙️ Hyper-Realistic 3D World
- **Stunning 3D Graphics**: Built with Three.js and React Three Fiber for immersive visuals
- **Dynamic Environment**: Realistic terrain, buildings, trees, and atmospheric effects
- **Interactive Navigation**: Smooth camera controls and world exploration
- **Real-time Rendering**: High-performance WebGL rendering with shadows and lighting

### 🏠 Virtual Real Estate System
- **Property Ownership**: Buy, sell, and own virtual properties
- **Property Types**: Residential, Commercial, Land, and Luxury Estates
- **3D Property Markers**: Visual markers in the world showing available properties
- **Property Details**: Rich property information with images and features
- **Transaction History**: Complete record of all property transactions

### 💼 Real Estate Agent System
- **Become an Agent**: Register as a virtual real estate agent
- **Commission Earnings**: Earn 5% commission on every transaction you facilitate
- **Agent Dashboard**: Track your transactions, commissions, and success metrics
- **Property Listings**: List properties and help clients find their dream homes
- **Reputation System**: Build your reputation through successful transactions

### 👤 User Features
- **User Authentication**: Secure login and registration system
- **Virtual Wallet**: Manage your virtual currency balance
- **Profile Customization**: Customize your avatar and profile
- **Role System**: User, Agent, and Admin roles
- **Real-time Updates**: Live updates via WebSocket connections

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser with WebGL support

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
   cd server
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend client on `http://localhost:3000`

### Default Credentials
- **Admin Account**: 
  - Email: `admin@metaworld.com`
  - Password: `admin123`

## 📁 Project Structure

```
meta-the-world/
├── client/                 # Next.js frontend application
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   │   ├── VirtualWorld.tsx      # Main 3D world component
│   │   ├── PropertyMarker.tsx    # 3D property markers
│   │   ├── PropertyPanel.tsx     # Property browsing UI
│   │   ├── AgentPanel.tsx        # Agent dashboard
│   │   └── ...
│   ├── store/             # Zustand state management
│   └── ...
├── server/                # Express.js backend
│   ├── routes/            # API routes
│   │   ├── auth.js        # Authentication
│   │   ├── properties.js  # Property management
│   │   ├── transactions.js # Transaction handling
│   │   ├── agents.js      # Agent management
│   │   └── users.js       # User management
│   ├── database.js        # SQLite database setup
│   └── index.js           # Server entry point
└── ...
```

## 🎮 How to Use

### As a User
1. **Register/Login**: Create an account or login
2. **Explore the World**: Navigate the 3D world using mouse controls
3. **Browse Properties**: Click on property markers to see details
4. **Purchase Properties**: Buy properties using your virtual wallet
5. **Add Funds**: Add virtual currency to your wallet

### As a Real Estate Agent
1. **Register as Agent**: Go to Agent Panel and register
2. **Get Listed**: Your profile will be available to buyers
3. **Facilitate Transactions**: When buyers use your services, you earn 5% commission
4. **Track Performance**: Monitor your transactions and earnings in the dashboard
5. **Build Reputation**: Complete more transactions to build your reputation

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Properties
- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (authenticated)
- `PUT /api/properties/:id` - Update property (authenticated)

### Transactions
- `GET /api/transactions` - Get user's transactions
- `POST /api/transactions` - Purchase property

### Agents
- `POST /api/agents/register` - Register as agent
- `GET /api/agents` - Get all agents
- `GET /api/agents/:userId` - Get agent profile
- `GET /api/agents/:userId/transactions` - Get agent transactions

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update profile
- `POST /api/users/wallet/add` - Add funds to wallet

## 🛠️ Technologies Used

### Frontend
- **Next.js 14** - React framework
- **React Three Fiber** - 3D rendering
- **Three.js** - 3D graphics library
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Socket.io Client** - Real-time updates

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **SQLite** - Database
- **Socket.io** - WebSocket server
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 🎨 Features in Detail

### Hyper-Realistic Graphics
- Advanced lighting with shadows
- Realistic terrain with displacement mapping
- Procedurally generated buildings and trees
- Atmospheric fog and sky effects
- Smooth animations and transitions

### Real Estate System
- Complete property lifecycle management
- Secure transaction processing
- Automatic commission calculation
- Property ownership transfer
- Status tracking (available, sold, pending)

### Agent Commission System
- Automatic 5% commission on facilitated sales
- Commission tracking and history
- Agent statistics and metrics
- Transaction-based reputation

## 🔒 Security Features
- JWT-based authentication
- Password hashing with bcrypt
- SQL injection protection
- CORS configuration
- Input validation

## 🚧 Future Enhancements
- VR/AR support with WebXR
- Advanced avatar customization
- Social features and chat
- NFT integration for property ownership
- More property types and customization
- Advanced world generation
- Multiplayer interactions
- Voice chat integration

## 📝 License
MIT License

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ for the metaverse**
