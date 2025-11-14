# Quick Start Guide 🚀

## Prerequisites Check
- ✅ Node.js 18+ installed
- ✅ MongoDB running (local or cloud)

## Installation Steps

1. **Install all dependencies**
```bash
npm run install:all
```

2. **Set up environment** (optional - defaults work for local dev)
```bash
cp .env.example .env
# Edit .env if needed
```

3. **Start MongoDB** (if running locally)
```bash
# On macOS with Homebrew:
brew services start mongodb-community

# On Linux:
sudo systemctl start mongod

# Or run directly:
mongod
```

4. **Start the application**
```bash
npm run dev
```

This starts both:
- Backend API: http://localhost:3001
- Frontend App: http://localhost:5173

## First Steps in the World

1. **Create Account**: Sign up with email/password
2. **Enter World**: You'll spawn in the 3D world
3. **Explore**: Use WASD to move, mouse to look around
4. **Become an Agent**: Click briefcase icon → Get Licensed
5. **Buy Property**: Click building icon → Browse listings → Purchase
6. **Sell Property**: Click home icon → List your properties

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or check your cloud connection string
- Check `.env` file has correct `MONGODB_URI`

### Port Already in Use
- Change `PORT` in `.env` for backend
- Change port in `client/vite.config.js` for frontend

### Module Import Errors
- Ensure you're using Node.js 18+
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

## Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Customize the world in `client/src/components/3D/`
- Add new features following the existing patterns

Enjoy your virtual world! 🌍✨
