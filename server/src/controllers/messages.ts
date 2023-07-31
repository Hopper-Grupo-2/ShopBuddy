import Websocket from "../websocket";
import ErrorHandler from "../errors";
import IMessage from "../interfaces/message";
import MessagesServices from "../services/messages";
import { NextFunction, Request, Response } from "express";
import RedisCaching from "../database/caching/redisCaching";
import NotificationsController from "./notifications";
import { NotificationTypes } from "../interfaces/notification";

export default class MessagesController {
  public static async postMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.user;

      if (!user)
        throw ErrorHandler.createError(
          "UnauthorizedError",
          "Token does not contain the user's data"
        );

      const userId = user._id?.toString() ?? "";

      const listId = req.params.listId;
      const messageBody = req.body;
      const createdMessage: IMessage = await MessagesServices.createMessage(
        messageBody.textContent,
        listId,
        userId
      );

      //websocket
      const websocket = Websocket.getIstance();
      websocket.broadcastToList(listId, userId, "chatMessage", createdMessage);

      NotificationsController.sendNewListNotification(
        userId,
        listId,
        NotificationTypes.MESSAGE_FROM_LIST,
        createdMessage.textContent
      );

      res.status(200).json({ error: null, data: createdMessage });

      // clear cached data about MESSAGES
      await RedisCaching.clearCache("messages");
      await RedisCaching.clearCache(`messages/listId/${listId}`);
    } catch (error) {
      next(error);
    }
  }

  public static async getAllMessages(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const messagesFromCache = await RedisCaching.getCacheByKeyname(
        "messages"
      );

      if (messagesFromCache.length > 0) {
        res.status(200).json({ error: null, data: messagesFromCache });
        return;
      }

      const allMessages = await MessagesServices.getAllMessages();
      res.status(200).json({ error: null, data: allMessages });

      if (allMessages && allMessages.length > 0) {
        await RedisCaching.setCache("messages", allMessages);
      }
    } catch (error) {
      next(error);
    }
  }

  public static async getMessagesByListId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.user;

      if (!user)
        throw ErrorHandler.createError(
          "UnauthorizedError",
          "Token does not contain the user's data"
        );

      const listId = req.params.listId;

      // checking cache
      const listMessagesFromCache = await RedisCaching.getCacheByKeyname(
        `messages/listId/${listId}`
      );

      if (listMessagesFromCache.length > 0) {
        res.status(200).json({
          error: null,
          data: listMessagesFromCache,
        });
        return;
      }

      const listMessages = await MessagesServices.getMessageByListId(
        listId,
        user._id as string
      );

      res.status(200).json({ error: null, data: listMessages });

      if (listMessages && listMessages.length > 0) {
        await RedisCaching.setCache(`messages/listId/${listId}`, listMessages);
      }
    } catch (error) {
      next(error);
    }
  }
}
