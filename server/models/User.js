const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: 'default-avatar'
  },
  walletAddress: {
    type: String,
    default: null
  },
  isAgent: {
    type: Boolean,
    default: false
  },
  agentLicense: {
    type: String,
    default: null
  },
  agentCommissionRate: {
    type: Number,
    default: 0.05, // 5% default commission
    min: 0,
    max: 1
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  virtualCurrency: {
    type: Number,
    default: 10000 // Starting currency
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
