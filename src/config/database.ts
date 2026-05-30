import mongoose from "mongoose";
import "dotenv/config";

const mongoURI: string | undefined = process.env.MONGODB_URL;

const connectDB = async (): Promise<void> => {
  try {
    if (!mongoURI) {
      throw new Error("MONGODB_URL is not defined.");
    }

    await mongoose.connect(mongoURI as string);
    console.log("✅ Mongo connected!");
  } catch (error: unknown) {
    console.error("❌ Error connecting to MongoDB:", error);
  }
};

export default connectDB;
