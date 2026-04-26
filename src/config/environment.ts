import dotenv from "dotenv";

dotenv.config();

interface Env {
  MONGODB_URL: string | undefined;
  PORT: string | undefined;
}

export const env: Env = {
  MONGODB_URL: process.env.MONGODB_URL,
  PORT: process.env.PORT,
};
