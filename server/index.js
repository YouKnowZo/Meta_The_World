const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

app.use(cors())
app.use(express.json())

// In-memory database (in production, use a real database)
let properties = []
let users = []
let transactions = []

// Initialize with some sample properties
const initializeSampleProperties = () => {
  const propertyTypes = ['residential', 'commercial', 'mansion', 'penthouse', 'land']
  const propertyNames = [
    'Skyline Penthouse',
    'Oceanview Mansion',
    'Downtown Loft',
    'Mountain Retreat',
    'Beachfront Villa',
    'City Center Office',
    'Luxury Estate',
    'Modern Condo',
    'Countryside Farm',
    'Urban Studio'
  ]

  for (let i = 0; i < 20; i++) {
    const x = (Math.random() - 0.5) * 800
    const z = (Math.random() - 0.5) * 800
    properties.push({
      id: uuidv4(),
      name: propertyNames[Math.floor(Math.random() * propertyNames.length)],
      type: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
      price: Math.floor(Math.random() * 500000) + 50000,
      size: `${Math.floor(Math.random() * 5000) + 1000} sq ft`,
      position: [x, 5, z],
      status: Math.random() > 0.3 ? 'available' : 'sold',
      ownerId: null,
      agentId: null,
      description: 'A beautiful property in the virtual world with stunning views and modern amenities.',
      createdAt: new Date()
    })
  }
}

initializeSampleProperties()

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  // Send initial properties
  socket.emit('properties', properties)

  // Handle property creation
  socket.on('createProperty', (propertyData) => {
    const newProperty = {
      id: uuidv4(),
      ...propertyData,
      createdAt: new Date()
    }
    properties.push(newProperty)
    io.emit('properties', properties)
    console.log('Property created:', newProperty.id)
  })

  // Handle property purchase
  socket.on('purchaseProperty', (data) => {
    const property = properties.find(p => p.id === data.propertyId)
    if (property && property.status === 'available') {
      property.status = 'sold'
      property.ownerId = data.buyerId
      property.soldAt = new Date()

      // Create transaction
      const transaction = {
        id: uuidv4(),
        propertyId: data.propertyId,
        amount: property.price,
        buyerId: data.buyerId,
        agentId: data.agentId,
        timestamp: new Date()
      }
      transactions.push(transaction)

      // Notify agent if they facilitated the sale
      if (data.agentId) {
        io.to(data.agentId).emit('propertySold', {
          transactionId: transaction.id,
          propertyId: data.propertyId,
          amount: property.price,
          buyer: data.buyerId
        })
      }

      io.emit('properties', properties)
      io.emit('transaction', transaction)
      console.log('Property sold:', data.propertyId)
    }
  })

  // Handle property listing
  socket.on('listProperty', (data) => {
    const property = properties.find(p => p.id === data.propertyId)
    if (property) {
      property.status = 'available'
      property.price = data.price || property.price
      property.agentId = data.agentId
      io.emit('properties', properties)
      console.log('Property listed:', data.propertyId)
    }
  })

  // Handle get properties request
  socket.on('getProperties', () => {
    socket.emit('properties', properties)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

// REST API endpoints
app.get('/api/properties', (req, res) => {
  res.json(properties)
})

app.get('/api/properties/:id', (req, res) => {
  const property = properties.find(p => p.id === req.params.id)
  if (property) {
    res.json(property)
  } else {
    res.status(404).json({ error: 'Property not found' })
  }
})

app.get('/api/transactions', (req, res) => {
  res.json(transactions)
})

app.get('/api/transactions/agent/:agentId', (req, res) => {
  const agentTransactions = transactions.filter(t => t.agentId === req.params.agentId)
  res.json(agentTransactions)
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Socket.io server ready for connections`)
})
