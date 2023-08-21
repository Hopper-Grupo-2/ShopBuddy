import { config } from "dotenv";
import RedisDatabase from "./redis";
import Logger from "../../../../server/src/log/logger";
config();

export default class RedisCaching {
  private constructor() {}

  public static async clearCacheByKeyName(keyName: string) {
    Logger.debug(`Cleaning cache: ${keyName}`);

    try {
      const redis = await RedisDatabase.getInstance();

      await redis.del(keyName);
      Logger.debug("Clear completed!");
    } catch (error) {
      Logger.error(`Error during clear cache: ${error}`);
    }
  }

  public static async setCacheKeyValueType<T>(keyName: string, value: T[]) {
    Logger.debug(`Saving in redis cache: ${keyName}`);
    const TTL = 60 * 60 * 24; //time to live in seconds

    try {
      const redis = await RedisDatabase.getInstance();

      await redis.set(keyName, JSON.stringify(value), "EX", TTL);
      Logger.debug("Save completed!");
    } catch (error) {
      Logger.error(`Error about clear cache redis: ${error}`);
    }
  }

  public static async getCacheFromKeyValueTypeByKeyname<T>(
    keyName: string
  ): Promise<T[] | null> {
    try {
      const redis = await RedisDatabase.getInstance();

      const cachedResultString = await redis.get(keyName);

      if (cachedResultString) {
        Logger.debug(`Get data from cache: ${keyName}`);
        const cachedData: T[] = JSON.parse(cachedResultString);
        return cachedData;
      }

      return null;
    } catch (error) {
      Logger.error(`Error class RedisCaching: ${error}`);
      return null;
    }
  }
  public static async insertOneAtEndCashedListType<T>(
    keyNameList: string,
    value: T
  ) {
    Logger.debug(`Saving at End this List redis cache: ${keyNameList}`);
    const TTL = 60 * 60 * 24; //time to live in seconds

    try {
      const redis = await RedisDatabase.getInstance();

      await redis.rpush(keyNameList, JSON.stringify(value));
      Logger.debug("Save completed!");
    } catch (error) {
      Logger.error(`Error about insert at end of List cache redis: ${error}`);
    }
  }

  public static async insertManyAtEndCashedListType<T>(
    keyNameList: string,
    values: T[]
  ) {
    Logger.debug(
      `Saving many elements at End this List redis cache: ${keyNameList}`
    );
    const TTL = 60 * 60 * 24; //time to live in seconds

    try {
      const redis = await RedisDatabase.getInstance();

      for (let i = 0; i < values.length; i++) {
        await redis.rpush(keyNameList, JSON.stringify(values[i]));
      }

      Logger.debug("Save completed!");
    } catch (error) {
      Logger.error(
        `Error about insert many values end of List cache redis:
        ${error}`
      );
    }
  }

  public static async clearAllCache() {
    Logger.debug(`Cleaning All cache...`);

    try {
      const redis = await RedisDatabase.getInstance();

      const allKeys = await redis.keys("*");

      // Delele all keys
      if (allKeys.length > 0) {
        await redis.del(...allKeys);
        Logger.debug("Clear completed!");
      } else {
        Logger.debug("No cache to clear.");
      }
    } catch (error) {
      Logger.error(`Error during clear cache: ${error}`);
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
        Logger.debug(`Get data from cache List type: ${keyName}`);
        return allElementsArray;
      } else {
        return null;
      }
    } catch (error) {
      Logger.error(`Error while getting list elements: ${error}`);
      return [];
    }
  }
}
