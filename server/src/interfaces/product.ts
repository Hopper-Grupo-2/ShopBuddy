import { Schema } from "mongoose";

export default interface IProduct {
  name: string;
  quantity: Number;
  unit: string;
  price?: Number;
  market?: String;
  checked?: Boolean;
  _id?: Schema.Types.ObjectId | string;
}
