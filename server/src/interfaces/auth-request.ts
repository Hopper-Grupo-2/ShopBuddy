import { Request } from "express";
import IUser from "./user";

export default interface AuthRequest extends Request {
	user: IUser;
}
