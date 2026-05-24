import mongoose from "mongoose";
import { env } from "./environment.js";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URL);
    console.log("✅ Mongo connected!");
  } catch (error: unknown) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
