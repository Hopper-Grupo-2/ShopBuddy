import Models from "../database/models";
import ErrorHandler from "../errors";
import IList from "../interfaces/list";

export default class ListsRepositories {
	private static Model = Models.getInstance().listModel;

	public static async findAllLists(): Promise<IList[] | null> {
		try {
			const lists = await this.Model.find().exec();
			return lists || null;
		} catch (error) {
			console.error(this.name, "getAllLists error:", error);
			throw error;
		}
	}

	public static async getListById(listId: string): Promise<IList | null> {
		try {
			const response = await this.Model.findOne({ _id: listId });

			if (response === null) return null;

			const list: IList = {
				_id: response._id,
				listName: response.listName,
				products: response.products,
				owner: response.owner,
				members: response.members,
				createdAt: response.createdAt,
				updatedAt: response.updatedAt,
			};

			return list;
		} catch (error) {
			console.error(this.name, "getListById error: ", error);
			throw ErrorHandler.createError(
				"InternalServerError",
				"Internal server error"
			);
		}
	}

	public static async createNewList(
		listName: string,
		userId: string
	): Promise<IList> {
		try {
			const response = await this.Model.create({
				listName: listName,
				products: [],
				owner: userId,
				members: [{ userId: userId }],
				createdAt: Date.now(),
				updatedAt: Date.now(),
			});
			const createdList: IList = {
				_id: response._id,
				listName: response.listName,
				products: response.products,
				owner: response.owner,
				members: [{ userId: response.members[0].userId }],
				createdAt: response.createdAt,
				updatedAt: response.createdAt,
			};
			return createdList;
		} catch (error) {
			console.error(this.name, "createNewList error: ", error);
			throw ErrorHandler.createError(
				"InternalServerError",
				"Error creating new list"
			);
		}
	}

	public static async isMember(
		userId: string,
		listId: string
	): Promise<boolean> {
		try {
			const response = await this.Model.findOne({
				_id: listId,
				members: { $elemMatch: { userId } },
			});
			return response === null ? false : true;
		} catch (error) {
			console.error(this.name, "isMember error: ", error);
			throw ErrorHandler.createError(
				"InternalServerError",
				"Error verifying if the user is a member from the list"
			);
		}
	}

	public static async deleteList(listId: string, ownerId: string): Promise<void> {
		try {
			const list = await this.Model.findOne({ _id: listId });
			if (!list) {
				throw ErrorHandler.createError("BadRequest", "List not found");
			}
	
			if (list.owner !== ownerId) {
				throw ErrorHandler.createError(
					"UnauthorizedError",
					"forbiddenError"
				);
			}
	
			await this.Model.deleteOne({ _id: listId });
		} catch (error) {
			console.error(this.name, "deleteList error: ", error);
			throw ErrorHandler.createError(
				"InternalServerError",
				"Internal server error"
			);
		}
	}
	
}
