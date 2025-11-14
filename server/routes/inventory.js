import express from 'express';
import InventoryItem from '../models/InventoryItem.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/my-inventory', authenticate, async (req, res) => {
  try {
    const inventory = await InventoryItem.find({ user: req.userId })
      .populate('product');
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/equip/:itemId', authenticate, async (req, res) => {
  try {
    const item = await InventoryItem.findById(req.params.itemId);
    if (!item || item.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Item not found' });
    }

    // Unequip other items of same category
    if (item.product.category === 'clothing') {
      await InventoryItem.updateMany(
        { user: req.userId, 'product.category': 'clothing', _id: { $ne: item._id } },
        { $set: { isEquipped: false } }
      );
    }

    item.isEquipped = !item.isEquipped;
    await item.save();

    // Update user avatar if clothing
    if (item.product.category === 'clothing' && item.isEquipped) {
      const user = await User.findById(req.userId);
      user.avatar.clothing.outfit = item.product.name;
      await user.save();
    }

    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
