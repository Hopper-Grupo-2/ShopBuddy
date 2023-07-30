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

export async function clearRedisCacheByEndpoint(keyName: string) {
    console.log(`Call function to clear redis cache ${keyName}`);
    //const connectionString = process.env.REDIS_CONNECTION_STRING || "";

    const redis = RedisDatabase.getInstance();

    try {
        await redis.del(keyName);
        console.log("Clear completed!");
    } catch (error) {
        console.error("Error about clear cache redis:", error);
    }
}

export async function saveDataInRedisCacheByEndpoint(
    keyName: string,
    value: any
) {
    console.log(`Save in redis cache  - ${keyName}`);
    const TTL = 30; //time to live in seconds
    const redis = RedisDatabase.getInstance();

    try {
        await redis.set(keyName, JSON.stringify(value), "EX", TTL);
        console.log("Save completed!");
    } catch (error) {
        console.error("Error about clear cache redis:", error);
    }
}

export async function getDataFromRedisCacheByKeyname(
    keyName: string
): Promise<any> {
    try {
        const redis = RedisDatabase.getInstance();

        const cachedResultString = await redis.get(keyName);

        if (cachedResultString) {
            console.log("Data get from cache");
            const cachedData: any = JSON.parse(cachedResultString);
            return cachedData;
        }

        return [] as any[];
    } catch (error) {
        console.error("Something happened to Redis", error);
        return [] as any[];
    }
}
