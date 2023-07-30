import { config } from "dotenv";
import Redis from "ioredis";
config();

export default class RedisDatabase {
    private static redis: Redis;
    private constructor() {}

    static getInstance() {
        if (!RedisDatabase.redis) {
            const connectionString =
                process.env.REDIS_CONNECTION_STRING || "redis://svcredis:6379";

            RedisDatabase.redis = new Redis(connectionString);
        }
        return RedisDatabase.redis;
    }
}

export class RedisCaching {
    private constructor() {}

    public static async clearCache(keyName: string) {
        console.log(`Cleaning cache: ${keyName}`);

        try {
            const redis = RedisDatabase.getInstance();

            await redis.del(keyName);
            console.log("Clear completed!");
        } catch (error) {
            console.error("Error during clear cache:", error);
        }
    }

    public static async setCache(keyName: string, value: any) {
        console.log(`Saving in redis cache: ${keyName}`);
        const TTL = 60 * 60 * 24; //time to live in seconds

        try {
            const redis = RedisDatabase.getInstance();

            await redis.set(keyName, JSON.stringify(value), "EX", TTL);
            console.log("Save completed!");
        } catch (error) {
            console.error("Error about clear cache redis:", error);
        }
    }

    public static async getCacheByKeyname(keyName: string): Promise<any> {
        try {
            const redis = RedisDatabase.getInstance();

            const cachedResultString = await redis.get(keyName);

            if (cachedResultString) {
                console.log(`Get data from cache: ${keyName}`);
                const cachedData: any = JSON.parse(cachedResultString);
                return cachedData;
            }

            return [] as any[];
        } catch (error) {
            console.error("Something happened to Redis", error);
            return [] as any[];
        }
    }
}
