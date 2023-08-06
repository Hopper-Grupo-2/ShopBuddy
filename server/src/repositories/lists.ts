import { response } from "express";
import Models from "../database/models";
import ErrorHandler from "../errors";
import IList from "../interfaces/list";
import IProduct from "../interfaces/product";
import IUser from "../interfaces/user";
import UsersRepositories from "./users";
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
      const lists = await this.Model.find({ "members.userId": userId });
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
      const timestamp = Date.now();
      const dateWithoutMS = new Date(Math.floor(timestamp / 1000) * 1000);
      const response = await this.Model.create({
        listName: listName,
        products: [],
        owner: userId.toString(),
        members: [{ userId: userId.toString() }],
        createdAt: dateWithoutMS,
        updatedAt: dateWithoutMS,
      });
      let createdAt = new Date(response.createdAt?.toString() || "");
      let updatedAt = new Date(response.updatedAt?.toString() || "");
      const createdList: IList = {
        _id: response._id.toString(),
        listName: response.listName,
        products: response.products,
        owner: response.owner.toString(),
        members: [{ userId: response.members[0].userId.toString() }],
        createdAt: createdAt?.toISOString(),
        updatedAt: updatedAt?.toISOString(),
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

  public static async deleteList(listId: string): Promise<void> {
    try {
      await this.Model.deleteOne({ _id: listId });
    } catch (error) {
      console.error(this.name, "deleteList error: ", error);
      throw ErrorHandler.createError(
        "InternalServerError",
        "Internal server error"
      );
    }
  }
  public static async changeListOwner(
    listId: string,
    currentOwnerId: string,
    newOwnerId: string
  ): Promise<void> {
    try {
      const list = await this.Model.findOne({
        _id: listId,
        owner: currentOwnerId,
      });
      await this.Model.updateOne(
        { _id: listId },
        { $set: { owner: newOwnerId } }
      );
    } catch (error) {
      console.error(this.name, "changeListOwner error: ", error);
      throw ErrorHandler.createError(
        "InternalServerError",
        `Erro ao trocar o proprietário da lista com ID: ${listId}`
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
        {
          $push: { products: productBody },
          $set: { updatedAt: new Date() },
        }
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
  ): Promise<IUser[] | null> {
    try {
      await this.Model.updateOne(
        { _id: listId },
        {
          $pull: { members: { userId: memberId } },
          $set: { updatedAt: new Date() },
        }
      );

      const list = await this.getListById(listId);

      if (list) {
        let members: IUser[] = [];

        for (const element of list.members) {
          const userId = element.userId.toString();
          const member = await UsersRepositories.getUserById(userId);

          if (member !== null) members.push(member);
        }

        return members;
      } else {
        throw "Error";
      }
    } catch (error) {
      console.error(this.name, "deleteMemberFromList error: ", error);
      throw ErrorHandler.createError(
        "InternalServerError",
        `Error deleting member with id ${memberId} from list with id: ${listId}`
      );
    }
  }

  public static async deleteProductFromList(
    listId: string,
    productId: string
  ): Promise<IList | null> {
    try {
      await this.Model.updateOne(
        { _id: listId },
        {
          $pull: { products: { _id: productId } },
          $set: { updatedAt: new Date() },
        }
      );

      const updatedList = await this.getListById(listId);
      return updatedList;
    } catch (error) {
      console.error(this.name, "deleteProductFromList error: ", error);
      throw ErrorHandler.createError(
        "InternalServerError",
        `Error deleting product with id ${productId} from list with id: ${listId}`
      );
    }
  }

  public static async invertProductCheck(
    listId: string,
    productId: string,
    newCheckValue: Boolean
  ): Promise<IList | null> {
    try {
      await this.Model.updateOne(
        { _id: listId, "products._id": productId },
        {
          $set: { "products.$.checked": newCheckValue, updatedAt: new Date() },
        }
      );

      const updatedList = await this.getListById(listId);
      return updatedList;
    } catch (error) {
      console.error(this.name, "invertProductCheck error: ", error);
      throw ErrorHandler.createError(
        "InternalServerError",
        `Error inverting "checked" field of the product with id ${productId} from list with id: ${listId}`
      );
    }
  }

  public static async updateProductInfo(
    listId: string,
    productId: string,
    newProductInfo: IProduct
  ): Promise<IList | null> {
    try {
      const updatedList = await this.Model.findOneAndUpdate(
        {
          _id: listId,
          "products._id": productId,
        },
        {
          $set: {
            "products.$.name": newProductInfo.name,
            "products.$.quantity": newProductInfo.quantity,
            "products.$.unit": newProductInfo.unit,
            "products.$.price": newProductInfo.price,
            updatedAt: new Date(),
          },
        },
        { new: true }
      );

      return updatedList;
    } catch (error) {
      console.error(this.name, "updateProductInfo error: ", error);
      throw ErrorHandler.createError(
        "InternalServerError",
        `Error updating info of the product with id ${productId} from list with id: ${listId}`
      );
    }
  }
  //
  // last bracket from class
  //
}
