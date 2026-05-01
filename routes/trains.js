import express from "express";
import { getBetweenTrains } from "../controllers/getBetweenTrains.js";
import { getTrainSchedule } from "../controllers/getTrainSchedule.js";
const router = express.Router();

router.get("/between",getBetweenTrains);

router.get("/schedule",getTrainSchedule);

export default router;