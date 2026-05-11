import { trainCache } from "../config/cache.js";
import { seedSchedulesForSmartRoute } from "../services/seedSchedulesForSmartRoute.js";
import { findLeg1, findLeg2 } from "../services/findLegRoutes.js";
import { getAIRecommendedJunctions } from "../services/getAIRecommendation.js";
import { getSmartRouteAvailability } from "../services/getSmartRouteAvailability.js";

export const smartRouteController = async (req, res) => {
    const { sourceCode, destCode, date } = req.query;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendUpdate = (message, data = null) => {
        res.write(`data: ${JSON.stringify({ message, data })}\n\n`);
    };

    try {
        sendUpdate("Fething Train Schedules...");
        const cacheKey = `${sourceCode}-${destCode}`;
        const trainNumbers = trainCache.get(cacheKey);

        if (!trainNumbers) {
            res.write(`data: ${JSON.stringify({ error: "Session expired. Please search again." })}\n\n`);
            return res.end();
        }

        await seedSchedulesForSmartRoute(trainNumbers, date);

        sendUpdate("Analysing Routes...");
        const leg1Route = await findLeg1(sourceCode);
        const leg2Route = await findLeg2(destCode);

        sendUpdate("AI is finding best junctions...");
        const aiResult = await getAIRecommendedJunctions(sourceCode, destCode, leg1Route, leg2Route);

        sendUpdate("Checking seat availability...");
        const availabilityResults = await getSmartRouteAvailability(aiResult.junctions, date);

        sendUpdate("Done!", availabilityResults);
        res.end();
        // return res.json({ success: true, message: "Ai Recommendation Done", data: availabilityResults });

        // return res.json({success:false,data:result})
    } catch (error) {
        // res.status(500).json({ success: false, message: error.message });
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
    }
}