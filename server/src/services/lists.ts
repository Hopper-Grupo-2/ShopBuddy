import IList from "../interfaces/list";
import ListsRepositories from "../repositories/lists";

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
}
