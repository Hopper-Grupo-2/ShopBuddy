import { NextFunction, Request, Response } from "express";
import ListsServices from "../services/lists";
import IUser from "../interfaces/user";
import IList from "../interfaces/list";
import ErrorHandler from "../errors";

export default class ListsController {
	public static async getLists(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const allLists = await ListsServices.getAllLists();
			res.status(200).json({ error: null, data: allLists });
		} catch (error) {
			next(error);
		}
	}

	public static async getListsByUserId(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		// GET /lists/:userId
	}

	public static async postList(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const user = req.user;

			if (!user)
				throw ErrorHandler.createError(
					"UnauthorizedError",
					"Token does not contain the user's data"
				);

			const listBody: IList = req.body;
			const createdList: IList = await ListsServices.createNewList(
				listBody.listName,
				user._id as string
			);
			res.status(200).json({ error: null, data: createdList });
		} catch (error) {
			next(error);
		}
	}
}
