export default interface INotification {
	_id: string;
	listId: string;
	userId: string;
	type: NotificationTypes;
	textContent: string;
	read: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export enum NotificationTypes {
	ADDED_TO_LIST = "ADDED_TO_LIST",
	REMOVED_FROM_LIST = "REMOVED_FROM_LIST",
	MESSAGE_FROM_LIST = "MESSAGE_FROM_LIST",
}
