import express from 'express';
import { getDataFromMongoDB } from '../utils/db.cjs';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const latestData = await getDataFromMongoDB();
    res.json(latestData);
  } catch (error) {
    console.error('Error fetching latest data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
