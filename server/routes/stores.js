import express from 'express';
import Store from '../models/Store.js';
import Product from '../models/Product.js';
import InventoryItem from '../models/InventoryItem.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { cityId, storeType } = req.query;
    const query = {};
    if (cityId) query.city = cityId;
    if (storeType) query.storeType = storeType;
    
    const stores = await Store.find(query).populate('products');
    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/products', async (req, res) => {
  try {
    const products = await Product.find({ store: req.params.id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:storeId/purchase', authenticate, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    const user = await User.findById(req.userId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stock !== -1 && product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const totalCost = product.price * quantity;

    if (user.balance < totalCost) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Update stock
    if (product.stock !== -1) {
      product.stock -= quantity;
      await product.save();
    }

    // Deduct balance
    user.balance -= totalCost;
    await user.save();

    // Add to inventory
    let inventoryItem = await InventoryItem.findOne({ user: req.userId, product: productId });
    if (inventoryItem) {
      inventoryItem.quantity += quantity;
    } else {
      inventoryItem = new InventoryItem({
        user: req.userId,
        product: productId,
        quantity
      });
    }
    await inventoryItem.save();

    // Apply product effects
    if (product.category === 'food' && product.attributes.hungerRestore) {
      user.stats.hunger = Math.min(100, user.stats.hunger + product.attributes.hungerRestore);
      await user.save();
    }

    res.json({ 
      success: true, 
      inventoryItem, 
      newBalance: user.balance,
      stats: user.stats
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
