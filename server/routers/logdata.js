
import express from 'express';
import { getDataFromMongoDB_Log } from '../utils/db.cjs';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const logData = await getDataFromMongoDB_Log();
    res.json(logData);
  } catch (error) {
    console.error('Error fetching latest data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


export default router;

