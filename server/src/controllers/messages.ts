import { NextFunction, Request, Response } from "express";
import MessagesServices from "../services/messages";
import ErrorHandler from "../errors";
import IMessage from "../interfaces/message";
import Websocket from "../websocket";
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

      const userId = user._id as string;

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
        listId,
        NotificationTypes.MESSAGE_FROM_LIST,
        createdMessage.textContent
      );

      res.status(200).json({ error: null, data: createdMessage });
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
      const allMessages = await MessagesServices.getAllMessages();
      res.status(200).json({ error: null, data: allMessages });
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
      const listMessages = await MessagesServices.getMessageByListId(
        listId,
        user._id as string
      );
      res.status(200).json({ error: null, data: listMessages });
    } catch (error) {
      next(error);
    }
  }

  // public static async getLists(
  // 	req: Request,
  // 	res: Response,
  // 	next: NextFunction
  // ): Promise<void> {
  // 	try {
  // 		const allLists = await ListsServices.getAllLists();
  // 		res.status(200).json({ error: null, data: allLists });
  // 	} catch (error) {
  // 		next(error);
  // 	}
  // }
}
