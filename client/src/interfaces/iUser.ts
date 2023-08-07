import { Schema } from "mongoose";

export default interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt?: Date;
  updatedAt: Date;
}

export interface IUserAll {
    _id?: Schema.Types.ObjectId | string;
    username: string;
}