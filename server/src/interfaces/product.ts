import { Schema } from "mongoose";

export default interface IProduct {
  productId?: Schema.Types.ObjectId | string;
  name: string;
  quantity: Number;
  unit: string;
  price: Number;
  checked: Boolean;
}
