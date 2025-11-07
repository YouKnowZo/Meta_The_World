import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Get land data
app.get('/api/lands', async (req, res) => {
  try {
    // TODO: Fetch from blockchain
    const lands = [
      { id: 1, x: 5, z: 3, owned: false, price: 2.5 },
      { id: 2, x: 10, z: 7, owned: true, price: 0 },
      // Add more lands...
    ]
    res.json(lands)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lands' })
  }
})

// Get land by ID
app.get('/api/lands/:id', async (req, res) => {
  try {
    const { id } = req.params
    // TODO: Fetch from blockchain
    const land = {
      id: parseInt(id),
      x: 5,
      z: 3,
      owned: false,
      price: 2.5,
      owner: null
    }
    res.json(land)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch land' })
  }
})

// Get user's lands
app.get('/api/users/:address/lands', async (req, res) => {
  try {
    const { address } = req.params
    // TODO: Fetch from blockchain
    const lands = []
    res.json(lands)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user lands' })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`)
})
