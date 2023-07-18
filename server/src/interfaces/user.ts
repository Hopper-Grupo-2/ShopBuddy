import { Schema } from "mongoose";

export default interface IUser {
    _id?: Schema.Types.ObjectId | string;
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUserUpdate {
    _id?: Schema.Types.ObjectId | string;
    username: string;
    email: string;
    oldPassword: string;
    newPassword: string;
    firstName: string;
    lastName: string;
    createdAt?: Date;
    updatedAt?: Date;
}
