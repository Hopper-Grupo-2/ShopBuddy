import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_DB = process.env.MONGO_DB;
const NODE_ENV = process.env.NODE_ENV;
const mongoURI = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@mongotest:27017/${MONGO_DB}`;

//connect to db
export async function connectDatabase() {
    await mongoose.connect(mongoURI);
    //console.log("===============");
    //console.log(mongoURI);
    //console.log("===============");
}

//disconnect and close connection
export async function closeDatabase() {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
}

//remove all data fro db
export async function clearDatabase() {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
}
