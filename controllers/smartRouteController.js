import { trainCache } from "../config/cache.js";
import { seedSchedulesForSmartRoute } from "../services/seedSchedulesForSmartRoute.js";
import { findLeg1, findLeg2 } from "../services/findLegRoutes.js";
import { getAIRecommendedJunctions } from "../services/getAIRecommendation.js";

export const smartRouteController = async (req, res) => {
    const { sourceCode, destCode, date } = req.query;

    try {
        const cacheKey = `${sourceCode}-${destCode}`;
        const trainNumbers = trainCache.get(cacheKey);

        if (!trainNumbers) {
            return res.status(400).json({
                success: false,
                message: "Session expired. Please search again",
            });
        }

        await seedSchedulesForSmartRoute(trainNumbers, date);

        const leg1Route = await findLeg1(sourceCode);
        const leg2Route = await findLeg2(destCode);

        const aiResult = await getAIRecommendedJunctions(sourceCode, destCode, leg1Route, leg2Route);

        return res.json({ success: true, message: "Ai Recommendation Done", data: aiResult });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}