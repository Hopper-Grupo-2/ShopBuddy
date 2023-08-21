import { NextFunction, Request, Response } from "express";
import NotificationsController from "./notifications";
import { NotificationTypes } from "../interfaces/notification";
import InvitesServices from "../services/invites";
import Websocket from "../websocket";
import IUser from "../interfaces/user";
import UsersRepositories from "../repositories/users";

export default class InvitesController {
  public static async postInviteLink(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.user;
      const userId = user?._id?.toString() ?? "";
      const listId = req.params.listId;

      const inviteLink = await InvitesServices.createInviteLink(listId, userId);
      const url = "/invites/" + inviteLink._id.toString();

      res.status(200).json({ error: null, data: { url } });
    } catch (error) {
      next(error);
    }
  }

  public static async joinListThroughInvite(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.user;
      const userId = user?._id?.toString() ?? "";
      const inviteId = req.params.inviteId;

      const [updatedList, invite] = await InvitesServices.addInvitedMember(
        inviteId,
        userId
      );

      const listId = invite.listId.toString() ?? "";
      const senderId = invite.userId.toString() ?? "";

      if (updatedList) {
        const members: IUser[] = [];

        for (const element of updatedList.members) {
          const userId = element.userId.toString();
          const member = await UsersRepositories.getUserById(userId);

          if (member !== null) members.push(member);
        }

        const websocket = Websocket.getIstance();
        websocket.broadcastToList(
          listId,
          user?._id?.toString() ?? "",
          "addMember",
          members
        );
      }

      NotificationsController.sendNewUserNotification(
        listId,
        userId,
        senderId,
        NotificationTypes.ADDED_TO_LIST,
        "Added to list" + listId
      );

      res.status(200).json({ error: null, data: updatedList });
    } catch (error) {
      next(error);
    }
  }
}
