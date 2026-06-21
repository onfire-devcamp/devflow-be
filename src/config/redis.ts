import { createClient, type RedisClientType } from "redis";
import { env } from "./environment.js";

export const redisClient: RedisClientType = createClient({
  url: env.REDIS_URL,
});

redisClient.on("error", (err: Error) => {
  console.error("Redis Client Error:", err.message);
});

redisClient.on("ready", () => {
  console.log("Redis connected!");
});

/**
 * Attempts to connect to Redis.
 * If the connection fails the error is logged and the app continues
 * without caching — all requests will fall through to MongoDB.
 */
export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Redis connection failed (caching disabled):", message);
  }
};

/** Returns `true` when the Redis client has an active connection. */
export const isRedisReady = (): boolean => redisClient.isReady;
