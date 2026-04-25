import dotenv from "dotenv";
dotenv.config();
export const env = {
  MONGODB_URL: process.env.MONGODB_URL,
  PORT: process.env.PORT,
};
