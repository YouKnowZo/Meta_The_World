import express from 'express';
import Land from '../models/Land.js';

const router = express.Router();

// Get all lands
router.get('/', async (req, res) => {
  try {
    const { owner, landType, minSize, maxSize } = req.query;

    let filter = {};
    if (owner) filter.owner = owner.toLowerCase();
    if (landType) filter.landType = landType;
    if (minSize || maxSize) {
      filter.size = {};
      if (minSize) filter.size.$gte = parseInt(minSize);
      if (maxSize) filter.size.$lte = parseInt(maxSize);
    }

    const lands = await Land.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, lands });
  } catch (error) {
    console.error('Error fetching lands:', error);
    res.status(500).json({ error: 'Failed to fetch lands' });
  }
});

// Get land by token ID
router.get('/:tokenId', async (req, res) => {
  try {
    const land = await Land.findOne({ tokenId: req.params.tokenId });

    if (!land) {
      return res.status(404).json({ error: 'Land not found' });
    }

    res.json({ success: true, land });
  } catch (error) {
    console.error('Error fetching land:', error);
    res.status(500).json({ error: 'Failed to fetch land' });
  }
});

// Create/update land (called after minting)
router.post('/', async (req, res) => {
  try {
    const { tokenId, owner, x, y, z, size, landType, metadata } = req.body;

    let land = await Land.findOne({ tokenId });

    if (land) {
      // Update existing land
      land.owner = owner.toLowerCase();
      land.metadata = metadata;
      await land.save();
    } else {
      // Create new land
      land = await Land.create({
        tokenId,
        owner: owner.toLowerCase(),
        coordinates: { x, y, z },
        size,
        landType,
        metadata,
      });
    }

    res.json({ success: true, land });
  } catch (error) {
    console.error('Error creating/updating land:', error);
    res.status(500).json({ error: 'Failed to save land' });
  }
});

// Update land metadata
router.put('/:tokenId', async (req, res) => {
  try {
    const { metadata } = req.body;

    const land = await Land.findOneAndUpdate(
      { tokenId: req.params.tokenId },
      { metadata, updatedAt: Date.now() },
      { new: true }
    );

    if (!land) {
      return res.status(404).json({ error: 'Land not found' });
    }

    res.json({ success: true, land });
  } catch (error) {
    console.error('Error updating land:', error);
    res.status(500).json({ error: 'Failed to update land' });
  }
});

export default router;
