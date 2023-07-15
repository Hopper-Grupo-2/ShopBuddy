import mongoose from "mongoose";

const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_DB = process.env.MONGO_DB;
const mongoURI = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@mongo:27017/${MONGO_DB}`;

export default async function connectDB() {
	try {
		await mongoose.connect(mongoURI);
	} catch (err) {
		console.log(err);
	}
}
