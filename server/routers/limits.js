import express from 'express';
import { getLimitsFromMongoDB, saveLimitsToMongoDB } from '../utils/db.cjs';

const router = express.Router();

// GET request to fetch latest limits
router.get('/', async (_req, res) => {
  try {
    const latestLimits = await getLimitsFromMongoDB();
    res.json(latestLimits);
  } catch (error) {
    console.error('Error fetching latest data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT request to save limits
router.put('/', async (req, res) => {
  try {
    const updatedLimits = req.body;
    await saveLimitsToMongoDB(updatedLimits);
    res.status(200).json({ message: 'Limits saved successfully' });
  } catch (error) {
    console.error('Error saving limits:', error);
    res.status(500).json({ message: 'Failed to save limits' });
  }
});

export default router;
