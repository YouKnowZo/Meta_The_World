# Meta The World - Backend

Node.js + Express + Socket.IO backend for Meta The World.

## Features

- 🔐 Wallet authentication
- 🗄️ MongoDB database
- 🔌 Real-time multiplayer via Socket.IO
- 📡 RESTful API
- 🏞️ Land management
- 🛒 Marketplace API

## Tech Stack

- **Node.js** - Runtime
- **Express** - Web framework
- **Socket.IO** - Real-time communication
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Ethers.js** - Blockchain interaction

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (with auto-reload)
npm run dev

# Start production server
npm start
```

## API Endpoints

### Authentication
```
POST /api/auth/verify
GET /api/auth/verify-token
```

### Lands
```
GET /api/lands
GET /api/lands/:tokenId
POST /api/lands
PUT /api/lands/:tokenId
```

### Marketplace
```
GET /api/marketplace
GET /api/marketplace/:tokenId
POST /api/marketplace
PUT /api/marketplace/:tokenId
DELETE /api/marketplace/:tokenId
```

### Health Check
```
GET /api/health
```

## WebSocket Events

### Client → Server
- `positionUpdate` - Player position
- `chatMessage` - Chat message

### Server → Client
- `playersInit` - Initial player list
- `playerJoined` - New player
- `playerUpdate` - Position update
- `playerDisconnected` - Player left
- `chatMessage` - Broadcast message

## Environment Variables

```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/meta-the-world
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

## Database Models

### Land
```javascript
{
  tokenId: Number,
  owner: String,
  coordinates: { x, y, z },
  size: Number,
  landType: String,
  metadata: Object
}
```

### Listing
```javascript
{
  tokenId: Number,
  seller: String,
  price: Number,
  landType: String,
  coordinates: { x, y, z },
  size: Number,
  active: Boolean
}
```

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for details.

## License

MIT
