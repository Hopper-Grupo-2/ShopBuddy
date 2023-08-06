import { config } from "dotenv";
import RedisDatabase from "./redis";

config();

export default class RedisCaching {
  private constructor() {}

  public static async clearCacheByKeyName(keyName: string) {
    console.log(`Cleaning cache: ${keyName}`);

    try {
      const redis = await RedisDatabase.getInstance();

      await redis.del(keyName);
      console.log("Clear completed!");
    } catch (error) {
      console.error("Error during clear cache:", error);
    }
  }

  public static async setCacheKeyValueType<T>(keyName: string, value: T[]) {
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

  public static async getCacheFromKeyValueTypeByKeyname<T>(
    keyName: string
  ): Promise<T[] | null> {
    try {
      const redis = await RedisDatabase.getInstance();

      const cachedResultString = await redis.get(keyName);

      if (cachedResultString) {
        console.log(`Get data from cache: ${keyName}`);
        const cachedData: T[] = JSON.parse(cachedResultString);
        return cachedData;
      }

      return null;
    } catch (error) {
      console.error("Error class RedisCaching:", error);
      return null;
    }
  }
  public static async insertOneAtEndCashedListType<T>(
    keyNameList: string,
    value: T
  ) {
    console.log(`Saving at End this List redis cache: ${keyNameList}`);
    const TTL = 60 * 60 * 24; //time to live in seconds

    try {
      const redis = await RedisDatabase.getInstance();

      await redis.rpush(keyNameList, JSON.stringify(value));
      console.log("Save completed!");
    } catch (error) {
      console.error("Error about insert at end of List cache redis:", error);
    }
  }

  public static async insertManyAtEndCashedListType<T>(
    keyNameList: string,
    values: T[]
  ) {
    console.log(
      `Saving many elements at End this List redis cache: ${keyNameList}`
    );
    const TTL = 60 * 60 * 24; //time to live in seconds

    try {
      const redis = await RedisDatabase.getInstance();

      for (let i = 0; i < values.length; i++) {
        await redis.rpush(keyNameList, JSON.stringify(values[i]));
      }

      console.log("Save completed!");
    } catch (error) {
      console.error(
        "Error about insert many values end of List cache redis:",
        error
      );
    }
  }

  public static async clearAllCache() {
    console.log(`Cleaning All cache...`);

    try {
      const redis = await RedisDatabase.getInstance();

      const allKeys = await redis.keys("*");

      // Delele all keys
      if (allKeys.length > 0) {
        await redis.del(...allKeys);
        console.log("Clear completed!");
      } else {
        console.log("No cache to clear.");
      }
    } catch (error) {
      console.error("Error during clear cache:", error);
    }
  }

  public static async getAllElementsFromListType<T>(
    keyName: string
  ): Promise<T[] | null> {
    try {
      const redis = await RedisDatabase.getInstance();

      const allElements = await redis.lrange(keyName, 0, -1);

      const allElementsArray: T[] = allElements.map((element) => {
        const elementObj: T = JSON.parse(element);
        return elementObj;
      });

      if (allElementsArray.length > 0) {
        console.log(`Get data from cache List type: ${keyName}`);
        return allElementsArray;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error while getting list elements:", error);
      return [];
    }
  }
}
