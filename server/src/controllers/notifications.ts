import { NotificationTypes } from "../interfaces/notification";
import ListsServices from "../services/lists";
import NotificationsServices from "../services/notifications";
import Websocket from "../websocket";

export default class NotificationsController {
	public static async sendNewListNotification(
		listId: string,
		userId: string,
		type: NotificationTypes,
		textContent: string
	) {
		try {
			const notification =
				await NotificationsServices.createNewListNotification(
					listId,
					userId,
					type,
					textContent
				);

			// broadcast notification to all clients
			const members = await ListsServices.getMembersByListId(listId);
			const websocket = Websocket.getIstance();
			members.forEach((member) => {
				websocket.broadcastToUser(
					listId,
					member._id!.toString(),
					"listNotification",
					notification
				);
			});
		} catch (error) {
			console.error(error);
		}
	}
}
