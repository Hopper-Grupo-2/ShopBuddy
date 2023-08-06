import { config } from "dotenv";
import RedisDatabase from "./redis";

config();

export default class RedisCaching {
  private constructor() {}

  public static async clearCache(keyName: string) {
    console.log(`Cleaning cache: ${keyName}`);

    try {
      const redis = await RedisDatabase.getInstance();

      await redis.del(keyName);
      console.log("Clear completed!");
    } catch (error) {
      console.error("Error during clear cache:", error);
    }
  }

  public static async setCache<T>(keyName: string, value: T) {
    console.log(`Saving in redis cache: ${keyName}`);
    const TTL = 60 * 60 * 24; //time to live in seconds

    try {
      const redis = await RedisDatabase.getInstance();

      await redis.set(keyName, JSON.stringify(value), "EX", TTL);
      console.log("Save completed!");
    } catch (error) {
      console.error("Error about clear cache redis:", error);
    }
  }

  public static async getCacheByKeyname<T>(keyName: string): Promise<T | null> {
    try {
      const redis = await RedisDatabase.getInstance();

      const cachedResultString = await redis.get(keyName);

      if (cachedResultString) {
        console.log(`Get data from cache: ${keyName}`);
        const cachedData: T = JSON.parse(cachedResultString);
        return cachedData;
      }

      return null;
    } catch (error) {
      console.error("Error class RedisCaching:", error);
      return null;
    }
  }
  public static async insertAtEndCashedList<T>(keyName: string, value: T) {
    console.log(`Saving at End this List redis cache: ${keyName}`);
    const TTL = 60 * 60 * 24; //time to live in seconds

    try {
      const redis = await RedisDatabase.getInstance();

      await redis.rpush(keyName, JSON.stringify(value), "EX", TTL);
      console.log("Save completed!");
    } catch (error) {
      console.error("Error about insert at end of List cache redis:", error);
    }
  }
}
