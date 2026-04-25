import mongoose from "mongoose";
const mongoURI = process.env.MONGODB_URL;
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ Mongo connected!");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
  }
};
export default connectDB;
