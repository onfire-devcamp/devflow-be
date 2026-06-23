import { RedisStore } from "rate-limit-redis";
import { redisClient } from "./redis.js";

export const createRedisStore = (prefix: string) => {
  return new RedisStore({
    prefix,
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  });
};
