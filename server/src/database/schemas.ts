import mongoose, { Schema, model } from "mongoose";
import IList from "../interfaces/list";
import IUser from "../interfaces/user";
import IMessage from "../interfaces/message";

export default class Schemas {
	private _listSchema: mongoose.Schema<IList>;
	private _userSchema: mongoose.Schema<IUser>;
	private _messageSchema: mongoose.Schema<IMessage>;

	constructor() {
		this._listSchema = this.setListSchema();
		this._userSchema = this.setUserSchema();
		this._messageSchema = this.setMessageSchema();
	}

	private setListSchema(): mongoose.Schema<IList> {
		return new mongoose.Schema<IList>({
			listName: { type: String, required: true },
			products: [
				{
					productId: { type: Number, required: true },
					name: { type: String, required: true },
					quantity: { type: Number, required: true },
					unit: { type: String, required: true },
					price: { type: Number, required: true },
					checked: { type: Boolean, default: true },
				},
			],
			owner: { type: Schema.Types.ObjectId, required: true },
			members: [{ userId: { type: Schema.Types.ObjectId } }],
			createdAt: { type: Date, default: Date.now() },
			updatedAt: { type: Date, default: Date.now() },
		});
	}

	private setUserSchema(): mongoose.Schema<IUser> {
		return new mongoose.Schema<IUser>({
			username: { type: String, unique: true, required: true },
			email: { type: String, unique: true, required: true },
			password: { type: String, required: true },
			firstName: { type: String, required: true },
			lastName: { type: String, required: true },
			createdAt: { type: Date, required: true },
			updatedAt: { type: Date, required: true },
		});
	}
	private setMessageSchema(): mongoose.Schema<IMessage> {
		return new mongoose.Schema<IMessage>({
			listId: { type: Schema.Types.ObjectId, required: true },
			userId: { type: Schema.Types.ObjectId, required: true },
			textContent: { type: String, required: true },
			createdAt: { type: Date, default: Date.now() },
		});
	}

	public get listSchema() {
		return this._listSchema;
	}

	public get userSchema() {
		return this._userSchema;
	}

	public get messageSchema() {
		return this._messageSchema;
	}
}
