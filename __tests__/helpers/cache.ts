import RedisDatabase from "../../server/src/database/caching/redis";
import dotenv from "dotenv";
dotenv.config();

//connect to db
export async function connectRedis() {
  await RedisDatabase.getInstance();
  //console.log("===============");
  //console.log(mongoURI);
  //console.log("===============");
}

//disconnect and close connection
export async function closeRedis() {
  await RedisDatabase.closeConnection();
}

//remove all data fro db
/*export async function clearRedis() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
}
*/
