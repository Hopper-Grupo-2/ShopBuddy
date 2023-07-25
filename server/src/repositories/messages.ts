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

			// should return all messages from the list (do it later)
			return createdMessage;
		} catch (error) {
			console.error(this.name, "createMessage error: ", error);
			throw ErrorHandler.createError(
				"InternalServerError",
				"Error creating new message"
			);
		}
	}

	public static async getAllMessages() {
		try {
			const response = await this.Model.find();
			const allMessages: IMessage[] = [];
			response.forEach((message) => {
				allMessages.push({
					_id: message._id,
					textContent: message.textContent,
					userId: message.userId,
					listId: message.listId,
					createdAt: message.createdAt,
				});
			});
			return allMessages;
		} catch (error) {
			console.error(this.name, "findAllMessages error: ", error);
			throw ErrorHandler.createError(
				"InternalServerError",
				"Error getting all messages"
			);
		}
	}

	public static async getMessageByListId(listId: string) {
		try {
			const response = await this.Model.find({ listId: listId });
			const listMessages: IMessage[] = [];
			response.forEach((message) => {
				listMessages.push({
					_id: message._id,
					textContent: message.textContent,
					userId: message.userId,
					listId: message.listId,
					createdAt: message.createdAt,
				});
			});
			listMessages.sort(
				(a, b) => b.createdAt.getTime() - a.createdAt.getTime()
			);
			return listMessages;
		} catch (error) {
			throw ErrorHandler.createError(
				"InternalServerError",
				"Error getting messages from the list"
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
