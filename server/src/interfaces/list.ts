import { Schema } from "mongoose";

export default interface IList {
	_id: Schema.Types.ObjectId;
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
	owner: Schema.Types.ObjectId;
	members: [{ userId: Schema.Types.ObjectId }];
	createdAt: Date;
	updatedAt: Date;
}
