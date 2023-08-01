import Redis from "ioredis";
import { config } from "dotenv";
config();

export default class RedisDatabase {
  private static redis: Redis;
  private constructor() {}

  static async getInstance() {
    if (!RedisDatabase.redis) {
      const connectionString =
        process.env.REDIS_CONNECTION_STRING || "redis://svcredis:6379";

      RedisDatabase.redis = new Redis(connectionString);
    }
    return RedisDatabase.redis;
  }

  static async closeConnection() {
    if (RedisDatabase.redis) {
      await RedisDatabase.redis.quit();
    }
  }
}
