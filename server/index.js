const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { ethers } = require('ethers')

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(bodyParser.json())

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

app.post('/auth/exchange', async (req, res) => {
  try {
    const { address, message, signature } = req.body
    if (!address || !message || !signature) return res.status(400).json({ error: 'missing' })

    // verify signature
    let signer
    try {
      signer = ethers.verifyMessage(message, signature)
    } catch (e) {
      return res.status(400).json({ error: 'invalid signature' })
    }

    if (signer.toLowerCase() !== address.toLowerCase()) {
      return res.status(403).json({ error: 'address mismatch' })
    }

    // Issue short-lived JWT
    const token = jwt.sign({ address }, JWT_SECRET, { expiresIn: '1h' })

    return res.json({ token })
  } catch (err) {
    console.error('auth error', err)
    return res.status(500).json({ error: 'server error' })
  }
})

app.listen(PORT, () => {
  console.log(`Auth server listening on http://localhost:${PORT}`)
})
