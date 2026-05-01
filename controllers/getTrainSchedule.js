import { convertDateFormat } from "../utils/dateConverter.js";
import TrainRoute from "../models/trainRoute.js";

export const getTrainSchedule = async (req, res) => {
    const { trainNo, date } = req.query;

    if (!trainNo || !date) {
        return res.status(400).json({
            status: 400,
            message: "trainNo and date are required"
        });
    }

    let convertedDate = convertDateFormat(date);
    const trainNoInSTR = String(trainNo);

    const options = {
        method: 'GET',
        headers: {
            'X-API-Key': process.env.RAIL_API_KEY,
            accept: 'application/json'
        }
    };

    const url = `https://api.railradar.org/api/v1/trains/${trainNo}/schedule?journeyDate=${convertedDate}`

    try {
        const scheduleExists = await TrainRoute.findOne({
            "train.number": trainNoInSTR
        });

        if (scheduleExists) {
            console.log("✅ Schedule fetched from DB");
            return res.status(200).json({
                source: "db",
                data: scheduleExists
            });
        }

        const response = await fetch(url, options);
        const result = await response.json();

        if (!result.success) {
            return res.status(400).json({
                status: 400,
                message: "Failed to fetch from API"
            });
        }

        const newTrainRoute = await TrainRoute.findOneAndUpdate(
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

        console.log("✅ New Schedule added to DB")
        return res.status(200).json({
            source: "api",
            data: newTrainRoute
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: "Something Went Wrong", error: error })
    }
}