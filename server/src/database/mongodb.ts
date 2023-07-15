import mongoose from "mongoose";

const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_DB = process.env.MONGO_DB;
const NODE_ENV = process.env.NODE_ENV;
const mongoURI = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@mongo${NODE_ENV}:27017/${MONGO_DB}`;

export default async function connectDB() {
	try {
		console.log(mongoURI);
		await mongoose.connect(mongoURI);
	} catch (err) {
		console.log(err);
	}
}
