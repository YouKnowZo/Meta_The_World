import express from 'express';
import MarketplaceListing from '../models/MarketplaceListing.js';
import User from '../models/User.js';
import InventoryItem from '../models/InventoryItem.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Create listing
router.post('/list', authenticate, async (req, res) => {
  try {
    const { itemType, itemId, price, quantity, description } = req.body;

    // Verify ownership
    const user = await User.findById(req.userId);
    let hasItem = false;

    if (itemType === 'product') {
      const inventoryItem = await InventoryItem.findOne({
        user: req.userId,
        product: itemId,
        quantity: { $gte: quantity || 1 }
      });
      hasItem = !!inventoryItem;
    } else if (itemType === 'car') {
      hasItem = user.ownedCars.includes(itemId);
    } else if (itemType === 'pet') {
      hasItem = user.ownedPets.includes(itemId);
    } else if (itemType === 'property') {
      hasItem = user.ownedProperties.includes(itemId);
    }

    if (!hasItem) {
      return res.status(400).json({ error: 'You do not own this item' });
    }

    const listing = new MarketplaceListing({
      seller: req.userId,
      item: {
        type: itemType,
        [itemType]: itemId
      },
      price,
      quantity: quantity || 1,
      description,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });

    await listing.save();
    res.json(listing);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Browse listings
router.get('/', async (req, res) => {
  try {
    const { itemType, minPrice, maxPrice, sort = 'newest' } = req.query;
    
    const query = { status: 'active' };
    if (itemType) {
      query['item.type'] = itemType;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    let sortQuery = {};
    if (sort === 'newest') sortQuery = { createdAt: -1 };
    else if (sort === 'price-low') sortQuery = { price: 1 };
    else if (sort === 'price-high') sortQuery = { price: -1 };

    const listings = await MarketplaceListing.find(query)
      .populate('seller', 'username avatar')
      .populate('item.product')
      .populate('item.car')
      .populate('item.pet')
      .populate('item.property')
      .sort(sortQuery)
      .limit(50);

    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Purchase listing
router.post('/:listingId/purchase', authenticate, async (req, res) => {
  try {
    const listing = await MarketplaceListing.findById(req.params.listingId)
      .populate('seller')
      .populate('item.product')
      .populate('item.car')
      .populate('item.pet')
      .populate('item.property');

    if (!listing || listing.status !== 'active') {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const buyer = await User.findById(req.userId);
    if (buyer.balance < listing.price) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Transfer item and funds
    buyer.balance -= listing.price;
    listing.seller.balance += listing.price;

    // Transfer item based on type
    if (listing.item.type === 'product') {
      let inventoryItem = await InventoryItem.findOne({
        user: listing.seller._id,
        product: listing.item.product._id
      });
      if (inventoryItem && inventoryItem.quantity >= listing.quantity) {
        inventoryItem.quantity -= listing.quantity;
        if (inventoryItem.quantity <= 0) {
          await inventoryItem.deleteOne();
        } else {
          await inventoryItem.save();
        }

        let buyerItem = await InventoryItem.findOne({
          user: req.userId,
          product: listing.item.product._id
        });
        if (buyerItem) {
          buyerItem.quantity += listing.quantity;
          await buyerItem.save();
        } else {
          buyerItem = new InventoryItem({
            user: req.userId,
            product: listing.item.product._id,
            quantity: listing.quantity
          });
          await buyerItem.save();
        }
      }
    } else if (listing.item.type === 'car') {
      listing.seller.ownedCars = listing.seller.ownedCars.filter(
        c => c.toString() !== listing.item.car._id.toString()
      );
      buyer.ownedCars.push(listing.item.car._id);
    } else if (listing.item.type === 'pet') {
      listing.seller.ownedPets = listing.seller.ownedPets.filter(
        p => p.toString() !== listing.item.pet._id.toString()
      );
      buyer.ownedPets.push(listing.item.pet._id);
    } else if (listing.item.type === 'property') {
      listing.seller.ownedProperties = listing.seller.ownedProperties.filter(
        p => p.toString() !== listing.item.property._id.toString()
      );
      buyer.ownedProperties.push(listing.item.property._id);
    }

    listing.status = 'sold';
    listing.soldAt = new Date();

    await Promise.all([
      buyer.save(),
      listing.seller.save(),
      listing.save()
    ]);

    res.json({ success: true, listing });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
