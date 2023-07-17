import ErrorHandler from "../errors";
import IMessage from "../interfaces/message";
import IUser from "../interfaces/user";
import MessagesRepositories from "../repositories/messages";
import UsersRepositories from "../repositories/users";

export default class ListsServices {
	private static Repository = MessagesRepositories;

	public static async createMessage(
		message: string,
		listId: string,
		userId: string
	): Promise<IMessage> {
		try {
			// verify if user exists
			const user: IUser | null = await UsersRepositories.getUserById(
				userId
			);

			if (user === null)
				throw ErrorHandler.createError(
					"UnauthorizedError",
					"User does not exist"
				);

			//lacks:
			// verify if list exists

			const createdMessage = await this.Repository.createMessage(
				message,
				listId,
				userId
			);

			return createdMessage;
		} catch (error) {
			throw error;
		}
	}

	// public static async getAllLists(): Promise<IList[] | null> {
	// 	try {
	// 		const lists = await this.Repository.findAllLists();
	// 		return lists || null;
	// 	} catch (error) {
	// 		throw error;
	// 	}
	// }
}
