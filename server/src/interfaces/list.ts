import { Schema } from "mongoose";

export default interface IList {
  _id: Schema.Types.ObjectId | string;
  listName: string;
  products: [
    {
      name: string;
      quantity: Number;
      unit: string;
      price: Number;
      checked: Boolean;
      _id: Schema.Types.ObjectId | string;
    }
  ];
  owner: Schema.Types.ObjectId | string;
  members: IMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IMember{
  userId: Schema.Types.ObjectId | string 
}
