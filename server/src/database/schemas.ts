import mongoose, { model } from "mongoose";
import IList from "../interfaces/list";

export default class Schemas {
	private static instance: Schemas;
	private _listSchema: mongoose.Schema<IList>;

	private constructor() {
		this._listSchema = new mongoose.Schema<IList>({
			listName: String,
			products: [
				{
					productId: Number,
					name: String,
					quantity: Number,
					unit: String,
					price: Number,
					checked: Boolean,
				},
			],
			members: [{ userId: mongoose.Types.ObjectId }],
			createdAt: Date,
			updatedAt: Date,
		});
	}

	public static getInstance(): Schemas {
		if (!Schemas.instance) {
			Schemas.instance = new Schemas();
		}
		return Schemas.instance;
	}

	public get listModel(): mongoose.Model<IList> {
		const listModel = model<IList>("List", this._listSchema);
		return listModel;
	}
}
// {
//     "_id": ObjectId("list1"),
//     "listName": "Grocery List",
//     "products": [
//       {
//         "productId": ObjectId("product1"),
//         "name": "Apples",
//         "quantity": 5
//       },
//       {
//         "productId": ObjectId("product2"),
//         "name": "Milk",
//         "quantity": 2
//       },
//       // Other products
//     ]
//     "members": [
//       {
//         "memberId": 0
//         "userId": 235
//       },
//       {
//         "memberId": 1
//         "userId": 4
//       },
//       {
//         "memberId": 0
//         "userId": 13357
//       },
//     ]
//     "timestamp": ISODate("2023-07-05T10:00:00Z")
//   }
