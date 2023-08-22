import { NextFunction, Request, Response } from "express";
import { NotificationTypes } from "../interfaces/notification";
import ListsServices from "../services/lists";
import NotificationsServices from "../services/notifications";
import Websocket from "../websocket";

import Logger from "../log/logger";
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
    senderId: string,
    type: NotificationTypes,
    textContent: string
  ) {
    try {
      const notification =
        await NotificationsServices.createNewListNotification(
          listId,
          userId,
          senderId,
          type,
          textContent
        );
      const websocket = Websocket.getIstance();
      websocket.broadcastToUser(
        //listId,
        userId,
        "listNotification",
        notification
      );
    } catch (error) {
      Logger.error(error);
    }
  }

  public static async sendNewListNotification(
    senderId: string,
    listId: string,
    type: NotificationTypes,
    textContent: string
  ) {
    try {
      // broadcast notification to all clients but the sender
      const members = await ListsServices.getMembersByListId(listId);
      const websocket = Websocket.getIstance();
      for (const member of members) {
        if (member._id?.toString() !== senderId) {
          Logger.debug("sending notification to user " + member._id);
          const notification =
            await NotificationsServices.createNewListNotification(
              listId,
              member._id?.toString() ?? "",
              senderId,
              type,
              textContent
            );

          websocket.broadcastToUser(
            //listId,
            member._id?.toString() ?? "",
            "listNotification",
            notification
          );
        }
      }
    } catch (error) {
      Logger.error(error);
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

      const notificationReadStatus =
        await NotificationsServices.readNotification(
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
        await NotificationsServices.readListNotifications(userId ?? "", listId);
      res.status(200).json({ error: null, data: notificationReadStatus });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteUserNotifications(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?._id?.toString();

      const wasDeleted = await NotificationsServices.deleteUserNotifications(
        userId ?? ""
      );
      res.status(200).json({ erro: null, data: wasDeleted });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteNotification(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?._id?.toString();
      const notificationId = req.params.notificationId;

      const wasDeleted = await NotificationsServices.deleteNotification(
        userId ?? "",
        notificationId
      );
      res.status(200).json({ erro: null, data: wasDeleted });
    } catch (error) {
      next(error);
    }
  }
}
