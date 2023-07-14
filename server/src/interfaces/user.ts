import { Schema } from "mongoose";

export default interface IUser {
	_id: Schema.Types.ObjectId;
	username: string;
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	createdAt: Date;
	updatedAt: Date;
}
