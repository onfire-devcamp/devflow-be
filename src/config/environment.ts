import dotenv from "dotenv";
import { SignOptions } from "jsonwebtoken";
dotenv.config();
const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
  throw new Error("FATAL ERROR: JWT_SECRET is not defined.");
}
const expireDay = process.env.JWT_EXPIRES_IN;
if (!expireDay) {
  throw new Error("FATAL ERROR: JWT_EXPIRES_IN is not defined.");
}
interface Env {
  MONGODB_URL: string | undefined;
  PORT: string | undefined;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: SignOptions["expiresIn"];
  SALT_ROUNDS: number;
}

export const env: Env = {
  MONGODB_URL: process.env.MONGODB_URL,
  PORT: process.env.PORT,
  JWT_SECRET: secretKey,
  JWT_EXPIRES_IN: expireDay as SignOptions["expiresIn"],
  SALT_ROUNDS: Number(process.env.SALT_ROUNDS) || 10,
};
