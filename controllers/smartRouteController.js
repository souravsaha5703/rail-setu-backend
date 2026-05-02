import { trainCache } from "../config/cache.js";
import { seedSchedulesForSmartRoute } from "../services/seedSchedulesForSmartRoute.js";

export const smartRouteController = async (req, res) => {
    const { sourceCode, destCode, date } = req.query;

    const cacheKey = `${sourceCode}-${destCode}`;
    const trainNumbers = trainCache.get(cacheKey);

    if (!trainNumbers) {
        return res.status(400).json({
            success: false,
            message: "Session expired. Please search again.",
        });
    }

    const allSchedule = await seedSchedulesForSmartRoute(trainNumbers, date);

    return res.json({ success: true, message: "Schedules ready", data: allSchedule });
}