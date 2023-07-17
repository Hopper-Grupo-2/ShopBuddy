import { Schema } from "mongoose";

export default interface IList {
	_id: Schema.Types.ObjectId | string;
	listName: string;
	products: [
		{
			productId: Number;
			name: string;
			quantity: Number;
			unit: string;
			price: Number;
			checked: Boolean;
		}
	];
	owner: Schema.Types.ObjectId | string;
	members: [{ userId: Schema.Types.ObjectId | string }];
	createdAt: Date;
	updatedAt: Date;
}
