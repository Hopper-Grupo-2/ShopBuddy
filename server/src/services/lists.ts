import ErrorHandler from "../errors";
import IList from "../interfaces/list";
import IUser from "../interfaces/user";
import ListsRepositories from "../repositories/lists";
import UsersRepositories from "../repositories/users";

export default class ListsServices {
	private static Repository = ListsRepositories;

	public static async getAllLists(): Promise<IList[] | null> {
		try {
			const lists = await this.Repository.findAllLists();
			return lists || null;
		} catch (error) {
			throw error;
		}
	}

	public static async getListsByUserId(userId: string): Promise<IList[] | null> {
		try {
			const lists = await this.Repository.findAllListsByUserId(userId);
			return lists || null;
		} catch (error) {
			throw error;
		}
	}

	public static async getListsByListId(listId: string): Promise<IList[] | null> {
		try {
			const lists = await this.Repository.findAllListsByListId(listId);
			return lists || null;
		} catch (error) {
			throw error;
		}
	}

	public static async createNewList(
		listName: string,
		userId: string
	): Promise<IList> {
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

			const createdList = await this.Repository.createNewList(
				listName,
				userId
			);
			return createdList;
		} catch (error) {
			throw error;
		}
	}
}
