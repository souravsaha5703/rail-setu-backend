import mongoose from "mongoose";

const RouteSchema = new mongoose.Schema({
    sequence: Number,
    stationCode: { type: String, required: true },
    stationName: { type: String, required: true },
    arrivalMinutes: { type: Number, default: null },
    departureMinutes: { type: Number, default: null },
    day: Number,
    distanceFromSourceKm: Number,
    isHalt: Boolean,
});

const TrainRouteSchema = new mongoose.Schema({
    train: {
        number: { type: String, required: true, unique: true },
        name: String,
        type: String,
        sourceStationCode: String,
        destinationStationCode: String,
    },
    route: [RouteSchema],
}, { timestamps: true });

TrainRouteSchema.index({ "route.stationCode": 1 });

const TrainRoute = mongoose.models.TrainRoute || mongoose.model('TrainRoute', TrainRouteSchema);

export default TrainRoute;