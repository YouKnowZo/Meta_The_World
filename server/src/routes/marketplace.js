import express from 'express';
import Listing from '../models/Listing.js';

const router = express.Router();

// Get all active listings
router.get('/', async (req, res) => {
  try {
    const { landType, minPrice, maxPrice, sortBy } = req.query;

    let filter = { active: true };
    if (landType) filter.landType = landType;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    let sort = { createdAt: -1 };
    if (sortBy === 'price_asc') sort = { price: 1 };
    if (sortBy === 'price_desc') sort = { price: -1 };

    const listings = await Listing.find(filter).sort(sort);
    res.json({ success: true, listings });
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// Get listing by token ID
router.get('/:tokenId', async (req, res) => {
  try {
    const listing = await Listing.findOne({
      tokenId: req.params.tokenId,
      active: true,
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json({ success: true, listing });
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
});

// Create listing
router.post('/', async (req, res) => {
  try {
    const { tokenId, seller, price, landType, coordinates, size, metadata } = req.body;

    // Check if already listed
    const existingListing = await Listing.findOne({ tokenId, active: true });
    if (existingListing) {
      return res.status(400).json({ error: 'Land already listed' });
    }

    const listing = await Listing.create({
      tokenId,
      seller: seller.toLowerCase(),
      price,
      landType,
      coordinates,
      size,
      metadata,
      active: true,
    });

    res.json({ success: true, listing });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// Update listing price
router.put('/:tokenId', async (req, res) => {
  try {
    const { price } = req.body;

    const listing = await Listing.findOneAndUpdate(
      { tokenId: req.params.tokenId, active: true },
      { price, updatedAt: Date.now() },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json({ success: true, listing });
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({ error: 'Failed to update listing' });
  }
});

// Cancel listing
router.delete('/:tokenId', async (req, res) => {
  try {
    const listing = await Listing.findOneAndUpdate(
      { tokenId: req.params.tokenId, active: true },
      { active: false, updatedAt: Date.now() },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json({ success: true, message: 'Listing cancelled' });
  } catch (error) {
    console.error('Error cancelling listing:', error);
    res.status(500).json({ error: 'Failed to cancel listing' });
  }
});

export default router;
