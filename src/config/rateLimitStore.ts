import { RedisStore } from "rate-limit-redis";
import { Redis } from "ioredis";
import { env } from "./environment.js";

// Dedicated ioredis client for rate limiting. ioredis automatically queues
// commands while offline, preventing the 'ClientClosedError' upon initialization.
const rateLimitRedisClient = new Redis(env.REDIS_URL);

export const createRedisStore = (prefix: string) => {
  return new RedisStore({
    prefix,
    // @ts-expect-error - ioredis types don't exactly match rate-limit-redis expected types
    sendCommand: (...args: string[]) =>
      rateLimitRedisClient.call(args[0], ...args.slice(1)),
  });
};
