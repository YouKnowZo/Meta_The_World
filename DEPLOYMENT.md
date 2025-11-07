# 🚀 Deployment Guide

This guide covers deploying Meta The World to production environments.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Smart Contract Deployment](#smart-contract-deployment)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Database Setup](#database-setup)
- [DNS & SSL](#dns--ssl)
- [Monitoring](#monitoring)

## Prerequisites

Before deploying, ensure you have:
- [ ] Production Ethereum wallet with ETH for gas fees
- [ ] Infura or Alchemy API key
- [ ] MongoDB Atlas account (or self-hosted MongoDB)
- [ ] Domain name (optional but recommended)
- [ ] Cloud hosting account (AWS, DigitalOcean, Railway, etc.)

## Smart Contract Deployment

### 1. Prepare Environment

Create a `.env` file in the `contracts/` directory:

```env
PRIVATE_KEY=your_wallet_private_key_without_0x
INFURA_API_KEY=your_infura_project_id
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### 2. Deploy to Testnet (Sepolia)

Test your contracts on Sepolia testnet first:

```bash
cd contracts
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

Save the deployed contract addresses!

### 3. Verify Contracts on Etherscan

```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

### 4. Deploy to Mainnet

⚠️ **WARNING**: Deploying to mainnet costs real ETH. Make sure everything is tested!

```bash
npx hardhat run scripts/deploy.js --network mainnet
```

### 5. Update Frontend Configuration

Add the deployed contract addresses to your frontend `.env`:

```env
VITE_LAND_NFT_CONTRACT_ADDRESS=0x...
VITE_MARKETPLACE_CONTRACT_ADDRESS=0x...
VITE_NETWORK_ID=1  # Mainnet
```

## Backend Deployment

### Option 1: Railway (Recommended for beginners)

1. **Install Railway CLI**
```bash
npm i -g @railway/cli
```

2. **Login and Initialize**
```bash
railway login
cd server
railway init
```

3. **Add Environment Variables**
```bash
railway variables set MONGODB_URI="your_mongodb_uri"
railway variables set JWT_SECRET="your_secret"
railway variables set CORS_ORIGIN="https://your-frontend-domain.com"
```

4. **Deploy**
```bash
railway up
```

### Option 2: DigitalOcean App Platform

1. **Create App**
   - Go to DigitalOcean console
   - Create New App from GitHub repo
   - Select `server` directory

2. **Configure Build**
   - Build Command: `npm install`
   - Run Command: `npm start`

3. **Set Environment Variables**
   - Add all variables from `.env.example`

4. **Deploy**
   - Click "Create Resources"

### Option 3: Docker + Any VPS

1. **Create Dockerfile** (already in server directory)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

2. **Build and Push to Registry**
```bash
docker build -t metaworld-server .
docker tag metaworld-server registry.example.com/metaworld-server
docker push registry.example.com/metaworld-server
```

3. **Deploy on VPS**
```bash
ssh user@your-vps
docker pull registry.example.com/metaworld-server
docker run -d -p 3001:3001 \
  -e MONGODB_URI="..." \
  -e JWT_SECRET="..." \
  --name metaworld-server \
  registry.example.com/metaworld-server
```

### Configure Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name api.metaworld.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
cd client
vercel
```

3. **Set Environment Variables**
   - Go to Vercel dashboard
   - Project Settings → Environment Variables
   - Add all `VITE_*` variables

4. **Redeploy**
```bash
vercel --prod
```

### Option 2: Netlify

1. **Build**
```bash
cd client
npm run build
```

2. **Deploy via Netlify CLI**
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

Or connect GitHub repo for automatic deployments.

### Option 3: Static Hosting (S3, Cloudflare Pages, etc.)

1. **Build**
```bash
cd client
npm run build
```

2. **Upload dist/ folder** to your static hosting service

3. **Configure redirects** for SPA routing:

For S3/CloudFront, add error page redirect:
- Error Code: 404
- Response Page Path: /index.html
- Response Code: 200

## Database Setup

### MongoDB Atlas (Recommended)

1. **Create Cluster**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create new cluster (Free tier available)

2. **Configure Network Access**
   - Add your server IP or 0.0.0.0/0 for all IPs
   - ⚠️ In production, whitelist only your server IPs

3. **Create Database User**
   - Create user with read/write permissions

4. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password

5. **Add to Environment Variables**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/metaworld?retryWrites=true&w=majority
```

### Self-Hosted MongoDB

```bash
# Install MongoDB
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongodb

# Connection string
MONGODB_URI=mongodb://localhost:27017/metaworld
```

## DNS & SSL

### 1. Point Domain to Server

Add DNS records:
```
A     @              your.server.ip.address
A     www            your.server.ip.address
A     api            your.server.ip.address
```

### 2. SSL Certificate (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d metaworld.com -d www.metaworld.com -d api.metaworld.com
```

Certbot will automatically configure Nginx for HTTPS!

## Monitoring

### 1. Application Monitoring

Use [PM2](https://pm2.keymetrics.io/) to keep your server running:

```bash
npm install -g pm2
cd server
pm2 start src/index.js --name metaworld-server
pm2 save
pm2 startup
```

### 2. Logging

Configure logging in production:

```javascript
// server/src/index.js
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

### 3. Uptime Monitoring

Use services like:
- [UptimeRobot](https://uptimerobot.com/) (Free)
- [Pingdom](https://www.pingdom.com/)
- [StatusCake](https://www.statuscake.com/)

### 4. Analytics

Add analytics to track usage:
- Google Analytics for web traffic
- Mixpanel for user events
- Custom analytics for in-world events

## Performance Optimization

### Frontend
- Enable CDN (Cloudflare, AWS CloudFront)
- Optimize 3D assets (use glTF compression)
- Implement lazy loading
- Use production builds

### Backend
- Enable Redis caching
- Use connection pooling for MongoDB
- Implement rate limiting
- Enable gzip compression

### Smart Contracts
- Optimize gas usage
- Use batch operations when possible
- Consider Layer 2 solutions (Polygon, Arbitrum)

## Security Checklist

- [ ] Environment variables secured (not in code)
- [ ] HTTPS enabled (SSL certificate)
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Database access restricted
- [ ] Smart contracts audited
- [ ] Regular backups configured
- [ ] Monitoring and alerts set up
- [ ] Firewall configured
- [ ] DDoS protection enabled

## Rollback Plan

Always have a rollback strategy:

1. **Keep previous deployment**
```bash
pm2 save  # Save current state
# If issues occur:
pm2 reload ecosystem.config.js  # Reload previous version
```

2. **Database backups**
```bash
# Backup before major changes
mongodump --uri="mongodb://..." --out=/backup/$(date +%Y%m%d)
```

3. **Smart contracts**
   - Smart contracts are immutable!
   - Deploy new version and update frontend to use new address
   - Keep old contracts accessible for historical data

## Support

If you encounter issues during deployment:
- Check logs: `pm2 logs metaworld-server`
- Review Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Check MongoDB logs: `sudo tail -f /var/log/mongodb/mongod.log`

For further assistance, contact the development team or open an issue on GitHub.

---

Happy deploying! 🚀