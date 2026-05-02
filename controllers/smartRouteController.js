import { trainCache } from "../config/cache.js";
import { seedSchedulesForSmartRoute } from "../services/seedSchedulesForSmartRoute.js";
import { findLeg1, findLeg2 } from "../services/findLegRoutes.js";

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

    await seedSchedulesForSmartRoute(trainNumbers, date);

    const leg1Route = await findLeg1(sourceCode);
    const leg2Route = await findLeg2(destCode);

    return res.json({ success: true, message: "Schedules ready", data: {leg1Route,leg2Route} });
}