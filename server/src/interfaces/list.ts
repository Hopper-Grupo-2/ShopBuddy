import { Schema } from "mongoose";
import IProduct from "./product";

export default interface IList {
  _id: Schema.Types.ObjectId | string;
  listName: string;
  products: IProduct[];
  owner: Schema.Types.ObjectId | string;
  members: IMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IMember{
  userId: Schema.Types.ObjectId | string 
}
