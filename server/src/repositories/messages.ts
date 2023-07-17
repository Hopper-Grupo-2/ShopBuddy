import Models from "../database/models";
import ErrorHandler from "../errors";
import IMessage from "../interfaces/message";

export default class MessagesRepositories {
	private static Model = Models.getInstance().messageModel;

	public static async createMessage(
		message: string,
		listId: string,
		userId: string
	) {
		try {
			const response = await this.Model.create({
				listId: listId,
				userId: userId,
				textContent: message,
				createdAt: Date.now(),
			});
			const createdMessage: IMessage = {
				_id: response._id,
				textContent: response.textContent,
				userId: response.userId,
				listId: response.listId,
				createdAt: response.createdAt,
			};

			// should return all messages (do it later)
			return createdMessage;
		} catch (error) {
			console.error(this.name, "createNewUser error: ", error);
			throw ErrorHandler.createError(
				"InternalServerError",
				"Error creating new message"
			);
		}
	}

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
