import express from "express";
import { getBetweenTrains } from "../controllers/getBetweenTrains.js";
import { getTrainSchedule } from "../controllers/getTrainSchedule.js";
import { smartRouteController } from "../controllers/smartRouteController.js";
const router = express.Router();

router.get("/between",getBetweenTrains);

router.get("/schedule",getTrainSchedule);

router.get("/smart-connect",smartRouteController);

export default router;