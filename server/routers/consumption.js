import express from "express";
import { getConsumption } from "../controllers/consumption.js";
const router = express.Router();

router.get("/", getConsumption);

export default router;