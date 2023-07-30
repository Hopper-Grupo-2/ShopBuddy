import { NextFunction, Request, Response } from "express";
import { NotificationTypes } from "../interfaces/notification";
import ListsServices from "../services/lists";
import NotificationsServices from "../services/notifications";
import Websocket from "../websocket";

export default class NotificationsController {
  public static async getListNotifications(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?._id?.toString();

      const notifications =
        await NotificationsServices.getLatestListNotifications(userId ?? "");
      res.status(200).json({ error: null, data: notifications });
    } catch (error) {
      next(error);
    }
  }

  public static async sendNewUserNotification(
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
      const websocket = Websocket.getIstance();
      websocket.broadcastToUser(
        listId,
        userId,
        "listNotification",
        notification
      );
    } catch (error) {
      console.error(error);
    }
  }

  public static async sendNewListNotification(
    listId: string,
    type: NotificationTypes,
    textContent: string
  ) {
    try {
      // broadcast notification to all clients
      const members = await ListsServices.getMembersByListId(listId);
      const websocket = Websocket.getIstance();
      members.forEach(async (member) => {
        const notification =
          await NotificationsServices.createNewListNotification(
            listId,
            member._id?.toString() ?? "",
            type,
            textContent
          );

        websocket.broadcastToUser(
          listId,
          member._id?.toString() ?? "",
          "listNotification",
          notification
        );
      });
    } catch (error) {
      console.error(error);
    }
  }

  public static async readNotification(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?._id?.toString();
      const notificationId = req.params.notificationId;

      const notificationReadStatus = NotificationsServices.readNotification(
        userId ?? "",
        notificationId
      );
      res.status(200).json({ error: null, data: notificationReadStatus });
    } catch (error) {
      next(error);
    }
  }

  public static async readListNotifications(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?._id?.toString();
      const listId = req.params.listId;

      const notificationReadStatus =
        NotificationsServices.readListNotifications(userId ?? "", listId);
      res.status(200).json({ error: null, data: notificationReadStatus });
    } catch (error) {
      next(error);
    }
  }
}
