import MessagesRepositories from "../repositories/messages";

export default class ListsServices {
	private static Repository = MessagesRepositories;

	// public static async getAllLists(): Promise<IList[] | null> {
	// 	try {
	// 		const lists = await this.Repository.findAllLists();
	// 		return lists || null;
	// 	} catch (error) {
	// 		throw error;
	// 	}
	// }
}
