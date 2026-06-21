import type { Request, Response, NextFunction } from "express";
import { redisClient, isRedisReady } from "../config/redis.js";

/**
 * Cache-Aside middleware factory.
 *
 * On a cache HIT the cached JSON is returned immediately.
 * On a cache MISS `res.json` is intercepted so the outgoing body
 * is transparently written to Redis before being sent to the client.
 *
 * If Redis is unavailable the middleware silently falls through to
 * the next handler (i.e. the database).
 *
 * @param ttlSeconds Time-to-live for the cached entry in seconds.
 */
export const cacheResponse = (ttlSeconds: number) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    // Bypass cache entirely when Redis is not connected
    if (!isRedisReady()) {
      next();
      return;
    }

    const cacheKey = `cache:${req.originalUrl}`;

    try {
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData !== null) {
        // Cache HIT — return the stored response directly
        console.log(`Cache HIT: ${cacheKey}`);
        res.status(200).json(JSON.parse(cachedData));
        return;
      }

      // Cache MISS — intercept res.json to capture the outgoing body
      console.log(`Cache MISS: ${cacheKey}`);

      const originalJson = res.json.bind(res);

      res.json = (body) => {
        // Write to cache asynchronously (fire-and-forget)
        redisClient
          .setEx(cacheKey, ttlSeconds, JSON.stringify(body))
          .catch((err: unknown) => {
            const message = err instanceof Error ? err.message : String(err);
            console.error(`Redis setEx failed for ${cacheKey}:`, message);
          });

        return originalJson(body);
      };

      next();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Redis cache read failed for ${cacheKey}:`, message);
      next();
    }
  };
};
