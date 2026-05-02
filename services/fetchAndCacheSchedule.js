import TrainRoute from "../models/TrainRoute.js";
import { convertDateFormat } from "../utils/dateConverter.js";

export const fetchAndCacheSchedule = async (trainNumber, date) => {
    if (!trainNumber || !date) {
        throw new Error("trainNumber and date are required");
    }

    let convertedDate = convertDateFormat(date);
    const trainNoInSTR = String(trainNumber);

    const options = {
        method: 'GET',
        headers: {
            'X-API-Key': process.env.RAIL_API_KEY,
            accept: 'application/json'
        }
    };

    const url = `https://api.railradar.org/api/v1/trains/${trainNumber}/schedule?journeyDate=${convertedDate}`

    const scheduleExists = await TrainRoute.findOne({
        "train.number": trainNoInSTR
    });

    if (scheduleExists) {
        console.log("✅ Schedule fetched from DB");
        return scheduleExists;
    }

    const response = await fetch(url, options);
    const result = await response.json();

    if (!result.success) {
        throw new Error(`Failed to fetch schedule for train ${trainNoInSTR}`);
    }

    const newSchedule = await TrainRoute.findOneAndUpdate(
        { "train.number": trainNoInSTR },
        {
            $set: {
                route: result.data.route
            },
            $setOnInsert: {
                "train.number": result.data.train.number,
                "train.name": result.data.train.name,
                "train.type": result.data.train.type,
                "train.sourceStationCode": result.data.train.sourceStationCode,
                "train.destinationStationCode": result.data.train.destinationStationCode
            }
        },
        {
            upsert: true,
            returnDocument: "after"
        }
    );
    return newSchedule;
}