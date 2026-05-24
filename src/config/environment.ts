import dotenv from "dotenv";

dotenv.config({ override: true });

const require = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`FATAL: ${key} is not defined in environment.`);
  return value;
};

export const env = {
  PORT: process.env.PORT ?? "3000",
  MONGODB_URL: require("MONGODB_URL"),
  JWT_SECRET: require("JWT_SECRET"),
  JWT_EXPIRES_IN: require("JWT_EXPIRES_IN"),
  SALT_ROUNDS: Number(process.env.SALT_ROUNDS) || 10,
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? "http://localhost:5173",
};
