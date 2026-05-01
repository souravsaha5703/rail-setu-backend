import express from "express";
import {getStationList} from "../controllers/stationsController.js";
const router = express.Router();

router.get("/",getStationList);

export default router;