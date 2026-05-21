import dotenv from "dotenv";

dotenv.config();

interface Env {
  MONGODB_URL: string | undefined;
  PORT: string | undefined;
  JWT_SECRET: string | undefined;
  JWT_EXPIRES_IN: string | undefined;
}

export const env: Env = {
  MONGODB_URL: process.env.MONGODB_URL,
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
};
