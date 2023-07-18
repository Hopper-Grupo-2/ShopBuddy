import ErrorHandler from "../errors";
import IList from "../interfaces/list";
import IMessage from "../interfaces/message";
import IUser from "../interfaces/user";
import ListsRepositories from "../repositories/lists";
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

			// verify if list exists
			const list: IList | null = await ListsRepositories.getListById(
				listId
			);

			if (list === null)
				throw ErrorHandler.createError(
					"UnauthorizedError",
					"List does not exist"
				);

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

	public static async getAllMessages(): Promise<IMessage[]> {
		try {
			const allMessages: IMessage[] =
				await this.Repository.getAllMessages();
			return allMessages;
		} catch (error) {
			throw error;
		}
	}

	public static async getMessageByListId(
		listId: string,
		userId: string
	): Promise<IMessage[]> {
		try {
			// verify if user exists
			const user: IUser | null = await UsersRepositories.getUserById(
				userId
			);
			console.log(user);

			if (user === null)
				throw ErrorHandler.createError(
					"UnauthorizedError",
					"User does not exist"
				);

			// verify if list exists
			const list: IList | null = await ListsRepositories.getListById(
				listId
			);

			if (list === null)
				throw ErrorHandler.createError(
					"UnauthorizedError",
					"List does not exist"
				);

			// verify if the user is a member of the list
			const isMember: boolean = await ListsRepositories.isMember(
				userId,
				listId
			);
			if (!isMember)
				throw ErrorHandler.createError(
					"UnauthorizedError",
					"User is not a member of the list"
				);

			const listMessages: IMessage[] =
				await this.Repository.getMessageByListId(listId);
			return listMessages;
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
