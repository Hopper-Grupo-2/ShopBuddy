import ErrorHandler from "../errors";
import IUser from "../interfaces/user";
import INotification, { NotificationTypes } from "../interfaces/notification";
import UsersRepositories from "../repositories/users";
import NotificationsRepositories from "../repositories/notifications";
import ListsRepositories from "../repositories/lists";
import IList from "../interfaces/list";

export default class NotificationsServices {
  private static Repository = NotificationsRepositories;

  public static async getLatestListNotifications(
    userId: string
  ): Promise<INotification[]> {
    try {
      const user: IUser | null = await UsersRepositories.getUserById(userId);

      if (user === null)
        throw ErrorHandler.createError("NotFoundError", "User not found");

      const sevenDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);
      const latestNotifications = await this.Repository.getLatestNotifications(
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
      const user: IUser | null = await UsersRepositories.getUserById(userId);

      if (user === null)
        throw ErrorHandler.createError("NotFoundError", "User not found");

      // implement new business rules later

      const newNotification = await this.Repository.createListNotification(
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

  public static async readNotification(userId: string, notificationId: string) {
    try {
      const user: IUser | null = await UsersRepositories.getUserById(userId);

      if (user === null)
        throw ErrorHandler.createError("NotFoundError", "User not found");

      const notification: INotification | null =
        await this.Repository.getNotification(notificationId);

      if (notification === null)
        throw ErrorHandler.createError(
          "NotFoundError",
          "Notification not found"
        );

      const notificationReadStatus = await this.Repository.readNotification(
        notificationId
      );
      return notificationReadStatus;
    } catch (error) {
      throw error;
    }
  }

  public static async readListNotifications(userId: string, listId: string) {
    try {
      const user: IUser | null = await UsersRepositories.getUserById(userId);

      if (user === null)
        throw ErrorHandler.createError("NotFoundError", "User not found");

      const list: IList | null = await ListsRepositories.getListById(listId);

      if (list === null)
        throw ErrorHandler.createError("NotFoundError", "List not found");

      const notificationReadStatus =
        await this.Repository.readListNotifications(userId, listId);
      return notificationReadStatus;
    } catch (error) {
      throw error;
    }
  }

  public static async deleteUserNotifications(userId: string) {
    try {
      const user: IUser | null = await UsersRepositories.getUserById(userId);

      if (user === null)
        throw ErrorHandler.createError("NotFoundError", "User not found");

      const wasDeleted = await this.Repository.deleteUserNotifications(userId);
      return wasDeleted;
    } catch (error) {
      throw error;
    }
  }

  public static async deleteNotification(
    userId: string,
    notificationId: string
  ) {
    try {
      const user: IUser | null = await UsersRepositories.getUserById(userId);

      if (user === null)
        throw ErrorHandler.createError("NotFoundError", "User not found");

      const notification: INotification | null =
        await this.Repository.getNotification(notificationId);

      if (notification === null)
        throw ErrorHandler.createError(
          "NotFoundError",
          "Notification not found"
        );

      const wasDeleted = await this.Repository.deleteNotification(
        notificationId
      );
      return wasDeleted;
    } catch (error) {
      throw error;
    }
  }
}
