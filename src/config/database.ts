import mongoose from "mongoose";

const mongoURI: string | undefined = process.env.MONGODB_URL;

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoURI as string);
    console.log("✅ Mongo connected!");
  } catch (error: unknown) {
    console.error("❌ Error connecting to MongoDB:", error);
  }
};

export default connectDB;
