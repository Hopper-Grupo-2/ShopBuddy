import { NextFunction, Request, Response } from "express";
import ListsServices from "../services/lists";

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
}
