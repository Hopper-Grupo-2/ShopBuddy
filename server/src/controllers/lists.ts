import { NextFunction, Request, Response } from "express";
import ListsServices from "../services/lists";
import IUser from "../interfaces/user";
import IList from "../interfaces/list";
import ErrorHandler from "../errors";
import IProduct from "../interfaces/product";
import Websocket from "../websocket";
import NotificationsController from "./notifications";
import UsersRepositories from "../repositories/users";
import { NotificationTypes } from "../interfaces/notification";

export default class ListsController {
  public static async getLists(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const allLists = await ListsServices.getAllLists();
      res.status(200).json({ error: null, data: allLists });
    } catch (error) {
      next(error);
    }
  }

  public static async getListsByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userId = req.params.userId;

    try {
      const listsByUser = await ListsServices.getListsByUserId(userId);
      res.status(200).json({ error: null, data: listsByUser });
    } catch (error) {
      next(error);
    }
  }

  public static async getListByListId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const listId = req.params.listId;
    const userId = req.user?._id?.toString() || "";

    try {
      const listById = await ListsServices.getListByListId(listId, userId);
      res.status(200).json({ error: null, data: listById });
    } catch (error) {
      next(error);
    }
  }

  public static async getMembersByListId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const listId = req.params.listId;
    try {
      const membersById = await ListsServices.getMembersByListId(listId);
      //console.log("PEGUEI TUDO:", membersById);
      res.status(200).json({ error: null, data: membersById });
    } catch (error) {
      next(error);
    }
  }

  public static async postList(
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

      const listBody: IList = req.body;
      const createdList: IList = await ListsServices.createNewList(
        listBody.listName,
        user._id as string
      );
      res.status(200).json({ error: null, data: createdList });
    } catch (error) {
      next(error);
    }
  }
  public static async deleteList(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.user;
      const listId: string = req.params.listId;

      if (!user)
        throw ErrorHandler.createError(
          "UnauthorizedError",
          "Token does not contain the user's data"
        );

      await ListsServices.deleteList(listId, user._id as string);
      res.status(200).json({
        error: null,
        message: "List deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  public static async patchProduct(
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

      const listId: string = req.params.listId;
      const productBody: IProduct = req.body;

      const updatedList: IList | null = await ListsServices.addNewProduct(
        listId,
        productBody,
        user._id?.toString() ?? ""
      );

      //websocket
      const websocket = Websocket.getIstance();
      websocket.broadcastToList(
        listId,
        user._id as string,
        "addProduct",
        updatedList?.products
      );

      NotificationsController.sendNewListNotification(
        user._id?.toString() ?? "",
        listId,
        NotificationTypes.ADD_PRODUCT,
        "New product added at list" + listId
      );

      res.status(200).json({ error: null, data: updatedList });
    } catch (error) {
      next(error);
    }
  }

  public static async patchMembers(
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

      const listId: string = req.params.listId;
      const username: string = req.body.username;

      const updatedList: IList | null = await ListsServices.addNewMember(
        listId,
        username,
        user?._id?.toString() ?? ""
      );

      const websocket = Websocket.getIstance();

      if (updatedList) {
        const members: IUser[] = [];

        for (const element of updatedList.members) {
          const userId = element.userId.toString();
          //console.log(userId);
          const member = await UsersRepositories.getUserById(userId);

          if (member !== null) members.push(member);
        }

        websocket.broadcastToList(
          listId,
          user._id as string,
          "addMember",
          members
        );
      }

      // this is dangerous, maybe we rework it?
      const newMember = await UsersRepositories.getUserByUsername(username);

      console.log(newMember);

      websocket.broadcastToUser(
        newMember?._id?.toString() ?? "",
        "addedToList",
        "Added to list" + listId
      );

      NotificationsController.sendNewUserNotification(
        listId,
        newMember?._id?.toString() ?? "",
        user?._id?.toString() ?? "",
        NotificationTypes.ADDED_TO_LIST,
        "Added to list" + listId
      );

      res.status(200).json({ error: null, data: updatedList });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteMember(
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

      const listId: string = req.params.listId;
      const memberId: string = req.params.memberId;

      const updatedMembers: IUser[] | null =
        await ListsServices.deleteMemberFromList(
          listId,
          memberId,
          user._id?.toString() ?? ""
        );

      const websocket = Websocket.getIstance();
      websocket.broadcastToList(
        listId,
        user._id?.toString() ?? "",
        "deleteMember",
        updatedMembers
      );

      // pending tests, but the logic should be: if the removed member was the one
      // who made the request, don't send them a notification
      // (we will have to implement a different notification for the other users
      //  to notify that a member left the list, but that will be done later)
      if (memberId !== user._id?.toString()) {
        websocket.broadcastToUser(
          memberId,
          "deletedFromList",
          "Deleted From list" + listId
        );

        NotificationsController.sendNewUserNotification(
          listId,
          memberId,
          user._id?.toString() ?? "",
          NotificationTypes.REMOVED_FROM_LIST,
          "Removed from list" + listId
        );
      }

      res.status(200).json({ error: null, data: updatedMembers });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteProduct(
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

      const listId: string = req.params.listId;
      const productId: string = req.params.productId;

      const updatedList: IList | null =
        await ListsServices.deleteProductFromList(
          listId,
          productId,
          user._id as string
        );

      const websocket = Websocket.getIstance();
      websocket.broadcastToList(
        listId,
        user._id?.toString() ?? "",
        "deleteProduct",
        productId
      );

      NotificationsController.sendNewListNotification(
        user._id?.toString() ?? "",
        listId,
        NotificationTypes.REMOVE_PRODUCT,
        "Deleted product at list" + listId
      );

      res.status(200).json({ error: null, data: updatedList });
    } catch (error) {
      next(error);
    }
  }

  public static async putProduct(
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

      const listId: string = req.params.listId;
      const productId: string = req.params.productId;

      const updatedList: IList | null = await ListsServices.invertProductCheck(
        listId,
        productId,
        user._id?.toString() ?? ""
      );

      //websocket
      const websocket = Websocket.getIstance();
      websocket.broadcastToList(
        listId,
        user._id?.toString() ?? "",
        "checkProduct",
        productId
      );

      NotificationsController.sendNewListNotification(
        user._id?.toString() ?? "",
        listId,
        NotificationTypes.TOGGLE_PRODUCT,
        "Product changed status at list" + listId
      );

      res.status(200).json({ error: null, data: updatedList });
    } catch (error) {
      next(error);
    }
  }

  public static async patchProductInfo(
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

      const listId: string = req.params.listId;
      const productId: string = req.params.productId;

      const newProductInfo: IProduct = req.body;

      const updatedList: IList | null = await ListsServices.updateProductInfo(
        listId,
        productId,
        user._id as string,
        newProductInfo
      );

      const websocket = Websocket.getIstance();
      websocket.broadcastToList(
        listId,
        user._id?.toString() ?? "",
        "editProduct",
        updatedList?.products
      );

      res.status(200).json({ error: null, data: updatedList });
    } catch (error) {
      next(error);
    }
  }

  public static async searchProductByTerm(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.user;
      const searchTerm: string = req.params.searchTerm;

      const products = await ListsServices.searchProducts(
        searchTerm,
        user?._id?.toString() ?? ""
      );

      res.status(200).json({ error: null, data: products });
    } catch (error) {
      next(error);
    }
  }
}
