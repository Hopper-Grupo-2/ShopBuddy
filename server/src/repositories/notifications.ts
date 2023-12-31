import Models from "../database/models";
import ErrorHandler from "../errors";
import INotification, { NotificationTypes } from "../interfaces/notification";
import ListsRepositories from "./lists";
import UsersRepositories from "./users";

import Logger from "../log/logger";
export default class NotificationsRepositories {
  private static Model = Models.getInstance().notificationModel;

  public static async getNotification(
    notificationId: string
  ): Promise<INotification | null> {
    try {
      const notification = await this.Model.findOne({ _id: notificationId });
      return notification;
    } catch (error) {
      Logger.error(`${this.name} getLatestNotifications error: ${error}`);
      throw ErrorHandler.createError(
        "InternalServerError",
        "Error getting the notification"
      );
    }
  }

  public static async getLatestNotifications(
    userId: string,
    sevenDaysAgo: Date
  ): Promise<INotification[]> {
    try {
      const response = await this.Model.find({
        userId: userId,
        createdAt: { $gte: sevenDaysAgo },
      });
      const latestNotifications: INotification[] = [];
      try {
        response.forEach(async (notification) => {
          latestNotifications.push({
            _id: notification._id,
            listId: notification.listId,
            userId: notification.userId,
            senderId: notification.senderId,
            type: notification.type,
            read: notification.read,
            textContent: notification.textContent,
            createdAt: notification.createdAt,
            updatedAt: notification.updatedAt,
          });
        });
      } catch (error) {
        throw error;
      }
      return latestNotifications;
    } catch (error) {
      Logger.error(`${this.name} getLatestNotifications error: ${error}`);
      throw ErrorHandler.createError(
        "InternalServerError",
        "Error getting the latest notifications"
      );
    }
  }

  public static async createListNotification(
    listId: string,
    userId: string,
    senderId: string,
    type: NotificationTypes,
    textContent: string
  ): Promise<INotification> {
    try {
      const response = await this.Model.create({
        listId: listId,
        userId: userId,
        senderId: senderId,
        type: type,
        textContent: textContent,
        read: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      const createdListNotification: INotification = {
        _id: response._id,
        listId: response.listId,
        userId: response.userId,
        senderId: response.senderId,
        type: response.type,
        read: response.read,
        textContent: response.textContent,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      };

      return createdListNotification;
    } catch (error) {
      Logger.error(`${this.name} createListNotification error: ${error}`);
      throw ErrorHandler.createError(
        "InternalServerError",
        "Error creating notification"
      );
    }
  }

  public static async readNotification(
    notificationId: string
  ): Promise<boolean> {
    try {
      const response = await this.Model.updateOne(
        { _id: notificationId },
        { $set: { read: true } }
      );
      return response.acknowledged;
    } catch (error) {
      Logger.error(`${this.name} updateNotification error: ${error}`);
      throw ErrorHandler.createError(
        "InternalServerError",
        "Error updating notification"
      );
    }
  }

  public static async readListNotifications(
    userId: string,
    listId: string
  ): Promise<boolean> {
    try {
      const response = await this.Model.updateMany(
        { userId: userId, listId: listId },
        { $set: { read: true } }
      );
      return response.acknowledged;
    } catch (error) {
      Logger.error(`${this.name} readListNotifications error: ${error}`);
      throw ErrorHandler.createError(
        "InternalServerError",
        "Error updating list notifications"
      );
    }
  }

  public static async deleteUserListNotifications(
    userId: string,
    listId: string
  ): Promise<boolean> {
    try {
      const response = await this.Model.deleteMany({
        userId: userId,
        listId: listId,
      });
      return response.acknowledged;
    } catch (error) {
      Logger.error(`${this.name} deleteUserListNotifications error: ${error}`);
      throw ErrorHandler.createError(
        "InternalServerError",
        "Error deleting the user's list notifications"
      );
    }
  }

  public static async deleteUserNotifications(
    userId: string
  ): Promise<boolean> {
    try {
      const response = await this.Model.deleteMany({
        userId: userId,
      });
      return response.acknowledged;
    } catch (error) {
      Logger.error(`${this.name} deleteUserNotifications error: ${error}`);
      throw ErrorHandler.createError(
        "InternalServerError",
        "Error deleting the user's notifications"
      );
    }
  }

  public static async deleteNotification(
    notificationId: string
  ): Promise<boolean> {
    try {
      const response = await this.Model.deleteOne({ _id: notificationId });
      return response.acknowledged;
    } catch (error) {
      Logger.error(`${this.name} deleteNotification error: ${error}`);
      throw ErrorHandler.createError(
        "InternalServerError",
        "Error deleting the notification"
      );
    }
  }
}
