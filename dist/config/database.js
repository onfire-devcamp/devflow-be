import mongoose from "mongoose";
import { env } from "./environment.js";
const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGODB_URL);
        console.log("✅ Mongo connected!");
    }
    catch (error) {
        console.error("❌ Error connecting to MongoDB:", error);
        process.exit(1);
    }
};
export default connectDB;
