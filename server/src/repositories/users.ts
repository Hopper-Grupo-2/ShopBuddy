import Models from "../database/models";

export default class UsersRepositories {
	private static Model = Models.getInstance().userModel;

	// public static async findAllLists(): Promise<IList[] | null> {
	// 	try {
	// 		const lists = await this.Model.find().exec();
	// 		return lists || null;
	// 	} catch (error) {
	// 		console.error(this.name, "getAllLists error:", error);
	// 		throw error;
	// 	}
	// }
}
