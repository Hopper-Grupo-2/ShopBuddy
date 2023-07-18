import { NextFunction, Request, Response } from "express";
import MessagesServices from "../services/messages";
import ErrorHandler from "../errors";
import IMessage from "../interfaces/message";

export default class MessagesController {
	public static async postMessage(
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

			const listId = req.params.listId;
			const messageBody = req.body;
			const createdMessage: IMessage =
				await MessagesServices.createMessage(
					messageBody.textContent,
					listId,
					user._id as string
				);
			res.status(200).json({ error: null, data: createdMessage });
		} catch (error) {
			next(error);
		}
	}

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
