import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
  throw new Error("FATAL ERROR: JWT_SECRET is not defined.");
}
interface Env {
  MONGODB_URL: string | undefined;
  PORT: string | undefined;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string | undefined;
  SALT_ROUNDS: number;
}

export const env: Env = {
  MONGODB_URL: process.env.MONGODB_URL,
  PORT: process.env.PORT,
  JWT_SECRET: secretKey,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  SALT_ROUNDS: Number(process.env.SALT_ROUNDS) || 10,
};
