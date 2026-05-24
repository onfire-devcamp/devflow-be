import dotenv from "dotenv";
dotenv.config();
const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
    throw new Error("FATAL ERROR: JWT_SECRET is not defined.");
}
const expireDay = process.env.JWT_EXPIRES_IN;
if (!expireDay) {
    throw new Error("FATAL ERROR: JWT_EXPIRES_IN is not defined.");
}
export const env = {
    MONGODB_URL: process.env.MONGODB_URL,
    PORT: process.env.PORT,
    JWT_SECRET: secretKey,
    JWT_EXPIRES_IN: expireDay,
    SALT_ROUNDS: Number(process.env.SALT_ROUNDS) || 10,
};
