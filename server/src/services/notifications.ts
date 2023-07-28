import ErrorHandler from "../errors";
import IUser from "../interfaces/user";
import INotification, { NotificationTypes } from "../interfaces/notification";
import UsersRepositories from "../repositories/users";
import NotificationsRepositories from "../repositories/notifications";

export default class NotificationsServices {
	private static Repository = NotificationsRepositories;

	public static async getLatestListNotifications(
		userId: string
	): Promise<INotification[]> {
		try {
			const user: IUser | null = await UsersRepositories.getUserById(
				userId
			);

			if (user === null)
				throw ErrorHandler.createError(
					"NotFoundError",
					"User not found"
				);

			const sevenDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);
			const latestNotifications =
				await this.Repository.getLatestNotifications(
					userId,
					sevenDaysAgo
				);
			return latestNotifications;
		} catch (error) {
			throw error;
		}
	}

	public static async createNewListNotification(
		listId: string,
		userId: string,
		type: NotificationTypes,
		textContent: string
	): Promise<INotification> {
		try {
			const user: IUser | null = await UsersRepositories.getUserById(
				userId
			);

			if (user === null)
				throw ErrorHandler.createError(
					"NotFoundError",
					"User not found"
				);

			// implement new business rules later

			const newNotification =
				await this.Repository.createListNotification(
					listId,
					userId,
					type,
					textContent
				);

			return newNotification;
		} catch (error) {
			throw error;
		}
	}
}
