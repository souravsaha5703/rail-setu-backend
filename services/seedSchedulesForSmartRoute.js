import { fetchAndCacheSchedule } from "./fetchAndCacheSchedule.js";

export const seedSchedulesForSmartRoute = async (trainNumbers,date) => {
    const results = [];
    for (const trainNumber of trainNumbers) {
        try {
            const schedule = await fetchAndCacheSchedule(trainNumber,date);
            results.push(schedule);
        } catch (error) {
            console.error(`Failed to fetch schedule for ${trainNumber}:`, error.message);
        }
        // 300ms breathing room between API calls
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    return results;
}