import { NextFunction, Request, Response } from "express";
import UsersServices from "../services/users";

export default class UsersController {
	// public static async getLists(
	// 	req: Request,
	// 	res: Response,
	// 	next: NextFunction
	// ): Promise<void> {
	// 	try {
	// 		const allLists = await ListsServices.getAllLists();
	// 		res.status(200).json({ error: null, data: allLists });
	// 	} catch (error) {
	// 		next(error);
	// 	}
	// }
}
