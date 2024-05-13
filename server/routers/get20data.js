import express from 'express';
import { getDataFromMongoDB2 } from '../utils/db.cjs';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const latest20Data = await getDataFromMongoDB2();
    res.json(latest20Data);
  } catch (error) {
    console.error('Error fetching latest data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
