import mongoose from "mongoose";

/* const productsSchema = new mongoose.Schema({
	product: String,
	state: String,
	quantity: Number,
	unitPrice: Number,
});
const Products = mongoose.model("Products", productsSchema); */

export default async function connectDB() {
	try {
		console.log(process.env.MONGO_URI);
		await mongoose.connect(process.env.MONGO_URI!);
		console.log("hey it worked i guess");
	} catch (err) {
		console.log(err);
	}
}
