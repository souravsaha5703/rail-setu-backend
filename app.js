import express from "express";
import connectDB from "./config/db.js";
import router from "./routes/index.js";
import stationsRouter from "./routes/stations.js";
import trainsRouter from "./routes/trains.js";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();

await connectDB();

const app = express();

const PORT = process.env.PORT;

app.use(helmet());
app.use(compression());
app.use(cors({
    origin: ['http://localhost:5173'],
    exposedHeaders: ['X-Data-Version']
}));
app.use(express.json());
app.use('/api/health', router);
app.use('/api/stations', stationsRouter);
app.use('/api/trains', trainsRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong on the server!', message: err.stack });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});