import mongoose from "mongoose";
const mongoURI = process.env.MONGODB_URL;
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ Kết nối MongoDB Atlas thành công!");
  } catch (error) {
    console.error("❌ Lỗi kết nối:", error);
  }
};
export default connectDB;
