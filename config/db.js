import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_ATLAS);
        console.log("RailSetu DB is Connected");
    } catch (error) {
        console.error("Connection failed:", error);
        process.exit(1);
    }
};

export default connectDB;