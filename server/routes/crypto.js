import express from 'express';
import CryptoWallet from '../models/CryptoWallet.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { ethers } from 'ethers';

const router = express.Router();

// Network configurations
const NETWORKS = {
  polygon: {
    name: 'Polygon',
    rpc: process.env.POLYGON_RPC || 'https://polygon-rpc.com',
    chainId: 137,
    nativeCurrency: 'MATIC',
    faucetAmount: ethers.parseEther('10').toString(), // 10 MATIC for new users
    tokenAddress: process.env.MTW_TOKEN_ADDRESS_POLYGON || '0x0000000000000000000000000000000000000000'
  },
  ethereum: {
    name: 'Ethereum',
    rpc: process.env.ETHEREUM_RPC || 'https://eth.llamarpc.com',
    chainId: 1,
    nativeCurrency: 'ETH',
    faucetAmount: ethers.parseEther('0.01').toString(), // 0.01 ETH for new users
    tokenAddress: process.env.MTW_TOKEN_ADDRESS_ETHEREUM || '0x0000000000000000000000000000000000000000'
  }
};

// Connect wallet
router.post('/connect', authenticate, async (req, res) => {
  try {
    const { address, network = 'polygon' } = req.body;
    
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    let wallet = await CryptoWallet.findOne({ address: address.toLowerCase() });
    
    if (!wallet) {
      wallet = new CryptoWallet({
        user: req.userId,
        address: address.toLowerCase(),
        network
      });
      await wallet.save();
    } else if (wallet.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Wallet already connected to another account' });
    }

    // Update user's wallet address
    await User.findByIdAndUpdate(req.userId, {
      walletAddress: address.toLowerCase()
    });

    res.json({ wallet, network: NETWORKS[network] });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get wallet info
router.get('/wallet', authenticate, async (req, res) => {
  try {
    const wallet = await CryptoWallet.findOne({ user: req.userId });
    if (!wallet) {
      return res.json({ connected: false });
    }

    // Get real balance from blockchain (if RPC is configured)
    let balances = { ...wallet.balances };
    try {
      const network = NETWORKS[wallet.network];
      if (network.rpc && network.rpc !== 'https://polygon-rpc.com') {
        const provider = new ethers.JsonRpcProvider(network.rpc);
        const balance = await provider.getBalance(wallet.address);
        balances.native = ethers.formatEther(balance);
      }
    } catch (error) {
      console.error('Failed to fetch blockchain balance:', error);
    }

    res.json({
      connected: true,
      address: wallet.address,
      network: wallet.network,
      balances,
      networkInfo: NETWORKS[wallet.network],
      hasClaimedFaucet: wallet.hasClaimedFaucet
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Claim faucet (automatic starting balance)
router.post('/faucet/claim', authenticate, async (req, res) => {
  try {
    const wallet = await CryptoWallet.findOne({ user: req.userId });
    
    if (!wallet) {
      return res.status(400).json({ error: 'Wallet not connected. Connect your wallet first.' });
    }

    // Check if already claimed
    if (wallet.hasClaimedFaucet) {
      return res.status(400).json({ error: 'Faucet already claimed' });
    }

    const network = NETWORKS[wallet.network];
    const faucetAmount = network.faucetAmount;

    // Mark as claimed
    wallet.hasClaimedFaucet = true;
    wallet.lastFaucetClaim = new Date();
    wallet.balances.native = faucetAmount;
    
    wallet.transactions.push({
      type: 'faucet',
      amount: faucetAmount,
      token: 'native',
      txHash: `faucet-${Date.now()}`
    });

    await wallet.save();

    // Also give virtual currency bonus
    const user = await User.findById(req.userId);
    user.balance += 5000; // Bonus virtual currency
    await user.save();

    res.json({
      success: true,
      amount: ethers.formatEther(faucetAmount),
      currency: network.nativeCurrency,
      virtualBonus: 5000,
      message: `Claimed ${ethers.formatEther(faucetAmount)} ${network.nativeCurrency} + 5000 virtual currency!`
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get supported networks
router.get('/networks', (req, res) => {
  res.json(Object.entries(NETWORKS).map(([key, value]) => ({
    id: key,
    name: value.name,
    chainId: value.chainId,
    nativeCurrency: value.nativeCurrency,
    faucetAmount: ethers.formatEther(value.faucetAmount),
    rpc: value.rpc
  })));
});

export default router;
