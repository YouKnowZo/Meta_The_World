// MetaWorld Server - Handles multiplayer, persistence, and backend services

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// In-memory database (in production, use a real database)
const database = {
    users: new Map(),
    properties: new Map(),
    transactions: [],
    messages: []
};

// Serve static files
app.use(express.static(__dirname));
app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', users: database.users.size });
});

app.get('/api/properties', (req, res) => {
    const properties = Array.from(database.properties.values());
    res.json(properties);
});

app.post('/api/transaction', (req, res) => {
    const { userId, propertyId, amount } = req.body;
    
    const transaction = {
        id: uuidv4(),
        userId,
        propertyId,
        amount,
        timestamp: new Date(),
        type: 'purchase'
    };
    
    database.transactions.push(transaction);
    
    // Update property ownership
    if (database.properties.has(propertyId)) {
        const property = database.properties.get(propertyId);
        property.owner = userId;
        database.properties.set(propertyId, property);
    }
    
    // Broadcast to all clients
    broadcast({
        type: 'propertyPurchased',
        data: { propertyId, userId }
    });
    
    res.json({ success: true, transaction });
});

app.get('/api/leaderboard', (req, res) => {
    const users = Array.from(database.users.values())
        .map(u => ({
            name: u.name,
            balance: u.balance,
            properties: u.ownedProperties.length,
            level: u.level
        }))
        .sort((a, b) => b.balance - a.balance)
        .slice(0, 10);
    
    res.json(users);
});

// WebSocket handling for real-time multiplayer
wss.on('connection', (ws) => {
    const userId = uuidv4();
    console.log(`New user connected: ${userId}`);
    
    ws.userId = userId;
    
    // Send welcome message
    ws.send(JSON.stringify({
        type: 'welcome',
        userId: userId,
        message: 'Connected to MetaWorld'
    }));
    
    // Handle messages
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            handleWebSocketMessage(ws, data);
        } catch (err) {
            console.error('Error parsing message:', err);
        }
    });
    
    // Handle disconnect
    ws.on('close', () => {
        console.log(`User disconnected: ${userId}`);
        database.users.delete(userId);
        broadcast({
            type: 'userLeft',
            userId: userId
        });
    });
});

function handleWebSocketMessage(ws, data) {
    switch (data.type) {
        case 'userUpdate':
            database.users.set(ws.userId, data.user);
            broadcast({
                type: 'userUpdated',
                userId: ws.userId,
                user: data.user
            }, ws);
            break;
            
        case 'chat':
            const chatMessage = {
                id: uuidv4(),
                userId: ws.userId,
                userName: data.userName,
                message: data.message,
                timestamp: new Date()
            };
            database.messages.push(chatMessage);
            broadcast({
                type: 'chat',
                message: chatMessage
            });
            break;
            
        case 'propertyUpdate':
            if (data.property) {
                database.properties.set(data.property.id, data.property);
            }
            break;
            
        case 'getOnlineUsers':
            ws.send(JSON.stringify({
                type: 'onlineUsers',
                users: Array.from(database.users.values())
            }));
            break;
    }
}

function broadcast(data, excludeWs = null) {
    const message = JSON.stringify(data);
    wss.clients.forEach((client) => {
        if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════════════════════╗
    ║                                                       ║
    ║           🌍 MetaWorld Server Running 🌍             ║
    ║                                                       ║
    ║   Server: http://localhost:${PORT}                       ║
    ║   WebSocket: ws://localhost:${PORT}                      ║
    ║                                                       ║
    ║   Your virtual world awaits...                        ║
    ║                                                       ║
    ╚═══════════════════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
