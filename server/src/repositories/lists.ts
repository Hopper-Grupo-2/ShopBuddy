import Schemas from "../database/schemas";
import IList from "../interfaces/list";

export default class ListsRepositories {
	private static Model = Schemas.getInstance().listModel;

	public static async findAllLists(): Promise<IList[] | null> {
		try {
			const lists = await this.Model.find().exec();
			return lists || null;
		} catch (error) {
			console.error(this.name, "getAllLists error:", error);
			throw error;
		}
	}
}
