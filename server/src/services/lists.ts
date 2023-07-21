import ErrorHandler from "../errors";
import IList from "../interfaces/list";
import IProduct from "../interfaces/product";
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

	public static async getListsByUserId(
		userId: string
	): Promise<IList[] | null> {
		try {
			const lists = await this.Repository.findAllListsByUserId(userId);
			return lists || null;
		} catch (error) {
			throw error;
		}
	}

	public static async getListByListId(listId: string): Promise<IList | null> {
		try {
			const lists = await this.Repository.getListById(listId);
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
	public static async deleteList(
		listId: string,
		userId: string
	): Promise<void> {
		try {
			await this.Repository.deleteList(listId, userId);
		} catch (error) {
			throw error;
		}
	}

	public static async addNewProduct(
		listId: string,
		productBody: IProduct,
		userId: string
	): Promise<IList | null> {
		try {
			const listBody: IList | null = await ListsRepositories.getListById(
				listId
			);

			if (listBody === null)
				throw ErrorHandler.createError(
					"NotFoundError",
					"List not found"
				);

			const userExistsInList = listBody.members.some(
				(member) => String(member.userId) === userId
			);

			if (!userExistsInList)
				throw ErrorHandler.createError(
					"NotFoundError",
					`User doesn't belong to list with Id ${listId}`
				);

			const updatedList = await this.Repository.addNewProduct(
				listId,
				productBody
			);

			return updatedList;
		} catch (error) {
			throw error;
		}
	}

	public static async addNewMember(
		listId: string,
		memberId: string,
		ownerId: string
	): Promise<IList | null> {
		try {
			const listBody: IList | null = await ListsRepositories.getListById(
				listId
			);

			if (listBody === null)
				throw ErrorHandler.createError(
					"NotFoundError",
					"List not found"
				);

			if (String(listBody.owner) !== ownerId) {
				throw ErrorHandler.createError(
					"UnauthorizedError",
					"User is not the owner of the list"
				);
			}

			const user: IUser | null = await UsersRepositories.getUserById(
				memberId
			);

			if (user === null)
				throw ErrorHandler.createError(
					"NotFoundError",
					"Member user not found"
				);

			const userExistsInList = listBody.members.some(
				(member) => String(member.userId) === memberId
			);

			if (userExistsInList)
				throw ErrorHandler.createError(
					"Conflict",
					`User already belong to list with Id ${listId}`
				);

			const updatedList = await this.Repository.addNewMember(
				listId,
				memberId
			);

			return updatedList;
		} catch (error) {
			throw error;
		}
	}

	public static async deleteMemberFromList(
		listId: string,
		memberId: string,
		ownerId: string
	): Promise<IList | null> {
		try {
			const listBody: IList | null = await ListsRepositories.getListById(
				listId
			);

			if (listBody === null)
				throw ErrorHandler.createError(
					"NotFoundError",
					"List not found"
				);

			if (String(listBody.owner) !== ownerId) {
				throw ErrorHandler.createError(
					"UnauthorizedError",
					"User is not the owner of the list"
				);
			}

			if (ownerId === memberId) {
				throw ErrorHandler.createError(
					"UnauthorizedError",
					"Owner can not be deleted from their list"
				);
			}

			const user: IUser | null = await UsersRepositories.getUserById(
				memberId
			);

			if (user === null)
				throw ErrorHandler.createError(
					"NotFoundError",
					"Member user not found"
				);

			const userExistsInList = listBody.members.some(
				(member) => String(member.userId) === memberId
			);

			if (!userExistsInList)
				throw ErrorHandler.createError(
					"NotFoundError",
					`User doesn't belong to list with Id ${listId}`
				);

			const updatedList = await this.Repository.deleteMemberFromList(
				listId,
				memberId
			);

			return updatedList;
		} catch (error) {
			throw error;
		}
	}
}
