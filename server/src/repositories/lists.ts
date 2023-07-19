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

	public static async findAllListsByUserId(userId: string): Promise<IList[] | null> {
		try {
			const lists = await this.Model.find({ owner: userId });
			return lists || null;
		} catch (error) {
			console.error(this.name, "getListsByUserId error:", error);
			throw error;
		}
	}

	public static async findAllListsByListId(listId: string): Promise<IList[] | null> {
		try {
			const lists = await this.Model.find({ _id: listId });
			return lists || null;
		} catch (error) {
			console.error(this.name, "getListsByListId error:", error);
			throw error;
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
}
