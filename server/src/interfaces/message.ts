import { Schema } from "mongoose";

export default interface IMessage {
	_id: Schema.Types.ObjectId;
	listId: Schema.Types.ObjectId | string;
	userId: Schema.Types.ObjectId | string;
	textContent: string;
	createdAt: Date;
}
