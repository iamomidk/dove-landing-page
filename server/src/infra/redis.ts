import Redis from "ioredis";
import {logger} from "../config/logger";
import env from "../config/env";

export const redis = new Redis(env.REDIS_URL);

redis.on("connect", () => logger.info("✅ Redis connected"));
redis.on("ready", () => logger.debug("Redis ready"));
redis.on("reconnecting", () => logger.warn("Redis reconnecting..."));
redis.on("end", () => logger.warn("Redis connection closed"));
redis.on("error", (e) => logger.error({err: e}, "❌ Redis error"));