import { Schema } from "mongoose";

export default interface IMessage {
	_id: Schema.Types.ObjectId;
	listId: Schema.Types.ObjectId;
	userId: Schema.Types.ObjectId;
	textContent: string;
	createdAt: Date;
}
