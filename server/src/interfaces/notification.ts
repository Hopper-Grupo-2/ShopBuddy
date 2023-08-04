import { Schema } from "mongoose";

export default interface INotification {
  _id: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId | string;
  listId: Schema.Types.ObjectId | string;
  listName?: string;
  senderId: Schema.Types.ObjectId | string;
  senderName?: string;
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
  ADD_PRODUCT = "ADD_PRODUCT",
  TOGGLE_PRODUCT = "TOGGLE_PRODUCT",
  REMOVE_PRODUCT = "REMOVE_PRODUCT",
}
