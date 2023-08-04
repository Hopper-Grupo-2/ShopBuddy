import { Schema } from "mongoose";

export default interface IProduct {
  _id?: Schema.Types.ObjectId | string;
  name: string;
  quantity: Number;
  unit: string;
  price?: Number;
  market?: String;
  checked?: Boolean;
}
