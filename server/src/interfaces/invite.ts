import { Schema } from "mongoose";

export default interface IInvite {
  _id: Schema.Types.ObjectId | string;
  userId: Schema.Types.ObjectId | string;
  listId: Schema.Types.ObjectId | string;
  createdAt: Date;
}
