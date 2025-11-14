import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, walletAddress } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Give new users starting balance
    const startingBalance = 10000; // Virtual currency
    
    const user = new User({
      username,
      email,
      password: hashedPassword,
      walletAddress,
      balance: startingBalance
    });
    
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret');
    
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email,
        balance: user.balance
      },
      message: `Welcome! You've received ${startingBalance.toLocaleString()} virtual currency to get started.`
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret');
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
