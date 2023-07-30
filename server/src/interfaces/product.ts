import { Schema } from "mongoose";

export default interface IProduct {
  name: string;
  quantity: Number;
  unit: string;
  price: Number;
  checked?: Boolean;
  _id?: Schema.Types.ObjectId | string;
}
