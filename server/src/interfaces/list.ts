import mongoose from "mongoose";

export default interface IList {
	listName: String;
	products: [
		{
			productId: Number;
			name: String;
			quantity: Number;
			unit: String;
			price: Number;
			checked: Boolean;
		}
	];
	members: [{ userId: mongoose.Types.ObjectId }];
	createdAt: Date;
	updatedAt: Date;
}
