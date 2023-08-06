import Websocket from "../websocket";
import ErrorHandler from "../errors";
import IMessage from "../interfaces/message";
import MessagesServices from "../services/messages";
import { NextFunction, Request, Response } from "express";
import RedisCaching from "../database/caching/redisCaching";
import NotificationsController from "./notifications";
import { NotificationTypes } from "../interfaces/notification";

export default class ClearCacheController {
  public static async clearAllCache(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await RedisCaching.clearAllCache();

      res
        .status(200)
        .json({
          error: null,
          data: { message: "clear all cache successfully" },
        });
    } catch (error) {
      next(error);
    }
  }
}
