import mongoose, { model } from "mongoose";
import IList from "../interfaces/list";
import Schemas from "./schemas";
import IUser from "../interfaces/user";
import IMessage from "../interfaces/message";

export default class Models {
	private static instance: Models;
	private _schemas: Schemas;

	private constructor() {
		this._schemas = new Schemas();
	}

	public static getInstance(): Models {
		if (!Models.instance) {
			Models.instance = new Models();
		}
		return Models.instance;
	}

	public get listModel(): mongoose.Model<IList> {
		const listModel = model<IList>("List", this._schemas.messageSchema);
		return listModel;
	}

	public get userModel(): mongoose.Model<IUser> {
		return model<IUser>("User", this._schemas.userSchema);
	}

	public get messageModel(): mongoose.Model<IMessage> {
		return model<IMessage>("Message", this._schemas.messageSchema);
	}
}
