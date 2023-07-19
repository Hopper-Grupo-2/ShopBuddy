import { response } from "express";
import Models from "../database/models";
import ErrorHandler from "../errors";
import IList from "../interfaces/list";
import IProduct from "../interfaces/product";
export default class ListsRepositories {
  private static Model = Models.getInstance().listModel;

  public static async findAllLists(): Promise<IList[] | null> {
    try {
      const lists = await this.Model.find().exec();
      return lists || null;
    } catch (error) {
      console.error(this.name, "getAllLists error:", error);
      throw error;
    }
  }

  public static async findAllListsByUserId(
    userId: string
  ): Promise<IList[] | null> {
    try {
      const lists = await this.Model.find({ owner: userId });
      return lists || null;
    } catch (error) {
      console.error(this.name, "getListsByUserId error:", error);
      throw error;
    }
  }

  public static async findAllListsByListId(
    listId: string
  ): Promise<IList[] | null> {
    try {
      const lists = await this.Model.find({ _id: listId });
      return lists || null;
    } catch (error) {
      console.error(this.name, "getListsByListId error:", error);
      throw error;
    }
  }

  public static async getListById(listId: string): Promise<IList | null> {
    try {
      const response = await this.Model.findOne({ _id: listId });

      if (response === null) return null;

      const list: IList = {
        _id: response._id,
        listName: response.listName,
        products: response.products,
        owner: response.owner,
        members: response.members,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      };

      return list;
    } catch (error) {
      console.error(this.name, "getListById error: ", error);
      throw ErrorHandler.createError(
        "InternalServerError",
        "Internal server error"
      );
    }
  }

  public static async createNewList(
    listName: string,
    userId: string
  ): Promise<IList> {
    try {
      const response = await this.Model.create({
        listName: listName,
        products: [],
        owner: userId,
        members: [{ userId: userId }],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      const createdList: IList = {
        _id: response._id,
        listName: response.listName,
        products: response.products,
        owner: response.owner,
        members: [{ userId: response.members[0].userId }],
        createdAt: response.createdAt,
        updatedAt: response.createdAt,
      };
      return createdList;
    } catch (error) {
      console.error(this.name, "createNewList error: ", error);
      throw ErrorHandler.createError(
        "InternalServerError",
        "Error creating new list"
      );
    }
  }

  public static async isMember(
    userId: string,
    listId: string
  ): Promise<boolean> {
    try {
      const response = await this.Model.findOne({
        _id: listId,
        members: { $elemMatch: { userId } },
      });
      return response === null ? false : true;
    } catch (error) {
      console.error(this.name, "isMember error: ", error);
      throw ErrorHandler.createError(
        "InternalServerError",
        "Error verifying if the user is a member from the list"
      );
    }
  }

  public static async deleteList(
    listId: string,
    ownerId: string
  ): Promise<void> {
    try {
      const list = await this.Model.findOne({ _id: listId });
      if (!list) {
        throw ErrorHandler.createError("BadRequest", "List not found");
      }

      if (list.owner !== ownerId) {
        throw ErrorHandler.createError("UnauthorizedError", "forbiddenError");
      }

      await this.Model.deleteOne({ _id: listId });
    } catch (error) {
      console.error(this.name, "deleteList error: ", error);
      throw ErrorHandler.createError(
        "InternalServerError",
        "Internal server error"
      );
    }
  }

  public static async addNewProduct(
    listId: string,
    productBody: IProduct
  ): Promise<IList | null> {
    try {
      await this.Model.updateOne(
        { _id: listId },
        { $push: { products: productBody }, $set: { updatedAt: new Date() } }
      );

      const updatedList = await this.getListById(listId);
      return updatedList;
    } catch (error) {
      console.error(this.name, "addNewProduct error: ", error);
      throw ErrorHandler.createError(
        "InternalServerError",
        `Error inserting product into list with id: ${listId}`
      );
    }
  }

  public static async addNewMember(
    listId: string,
    memberId: string
  ): Promise<IList | null> {
    try {
      await this.Model.updateOne(
        { _id: listId },
        {
          $push: { members: { userId: memberId } },
          $set: { updatedAt: new Date() },
        }
      );

      const updatedList = await this.getListById(listId);
      return updatedList;
    } catch (error) {
      console.error(this.name, "addNewMember error: ", error);
      throw ErrorHandler.createError(
        "InternalServerError",
        `Error inserting member with id ${memberId} into list with id: ${listId}`
      );
    }
  }

  public static async deleteMemberFromList(
    listId: string,
    memberId: string
  ): Promise<IList | null> {
    try {
      await this.Model.updateOne(
        { _id: listId },
        {
          $pull: { members: { userId: memberId } },
          $set: { updatedAt: new Date() },
        }
      );

      const updatedList = await this.getListById(listId);
      return updatedList;
    } catch (error) {
      console.error(this.name, "deleteMemberFromList error: ", error);
      throw ErrorHandler.createError(
        "InternalServerError",
        `Error deleting member with id ${memberId} from list with id: ${listId}`
      );
    }
  }
}
