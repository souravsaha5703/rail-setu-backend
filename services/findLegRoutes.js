import TrainRoute from "../models/trainRoute.js";

export const findLeg1 = async (source) => {
    const leg1Trains = await TrainRoute.find({
        "route.stationCode": source
    }).lean();

    const trimmedLeg1 = leg1Trains
        .map(train => {
            const route = train.route;
            const sourceIndex = route.findIndex(s => s.stationCode === source);

            if (sourceIndex === -1) return null;

            return {
                trainNumber: train.train.number,
                trainName: train.train.name,
                route: route
                    .slice(sourceIndex)
                    .map(s => ({
                        code: s.stationCode,
                        name: s.stationName
                    }))
            };
        })
        .filter(Boolean);

    return trimmedLeg1;
}

export const findLeg2 = async (destination) => {
    const leg2Trains = await TrainRoute.find({
        "route.stationCode": destination
    }).lean();

    const trimmedLeg2 = leg2Trains
        .map(train => {
            const route = train.route;
            const destIndex = route.findIndex(s => s.stationCode === destination);

            if (destIndex === -1) return null;

            return {
                trainNumber: train.train.number,
                trainName: train.train.name,
                route: route
                    .slice(0, destIndex + 1)
                    .map(s => ({
                        code: s.stationCode,
                        name: s.stationName
                    }))
            };
        })
        .filter(Boolean);

    return trimmedLeg2;
}