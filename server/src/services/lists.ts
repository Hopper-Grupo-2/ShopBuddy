import ErrorHandler from "../errors";
import IList from "../interfaces/list";
import IProduct from "../interfaces/product";
import IUser from "../interfaces/user";
import ListsRepositories from "../repositories/lists";
import NotificationsRepositories from "../repositories/notifications";
import UsersRepositories from "../repositories/users";

export default class ListsServices {
  private static Repository = ListsRepositories;

  public static async getAllLists(): Promise<IList[] | null> {
    try {
      const lists = await this.Repository.findAllLists();
      return lists || null;
    } catch (error) {
      throw error;
    }
  }

  public static async getListsByUserId(
    userId: string
  ): Promise<IList[] | null> {
    try {
      const lists = await this.Repository.findAllListsByUserId(userId);
      return lists || null;
    } catch (error) {
      throw error;
    }
  }

  public static async getListByListId(
    listId: string,
    userId: string
  ): Promise<IList> {
    try {
      if (userId === "") {
        throw ErrorHandler.createError(
          "UnauthorizedError",
          "usuario não logado"
        );
      }
      const list = await this.Repository.getListById(listId);
      if (list === null)
        throw ErrorHandler.createError("NotFoundError", "List does not exist");

      const isMember = list.members.find((member) => member.userId.toString() === userId);
      if (!isMember) {
        throw ErrorHandler.createError(
          "ForbiddenError",
          "You are not a member of this list"
        );
      }
      return list;
    } catch (error) {
      throw error;
    }
  }

  public static async getMembersByListId(listId: string): Promise<IUser[]> {
    try {
      const list = await this.Repository.getListById(listId);

      if (list === null)
        throw ErrorHandler.createError("NotFoundError", "List does not exist");

      const members: IUser[] = [];

      for (const element of list.members) {
        const userId = element.userId.toString();
        //console.log(userId);
        const member = await UsersRepositories.getUserById(userId);

        if (member !== null) members.push(member);
      }

      return members;
    } catch (error) {
      throw error;
    }
  }

  public static async createNewList(
    listName: string,
    userId: string
  ): Promise<IList> {
    try {
      // verify if user exists
      const user: IUser | null = await UsersRepositories.getUserById(userId);

      if (user === null)
        throw ErrorHandler.createError(
          "UnauthorizedError",
          "User does not exist"
        );

      const createdList = await this.Repository.createNewList(listName, userId);
      return createdList;
    } catch (error) {
      throw error;
    }
  }
  public static async deleteList(
    listId: string,
    userId: string
  ): Promise<void> {
    try {
      const list = await this.Repository.getListById(listId);
      if (!list) {
        throw ErrorHandler.createError("BadRequest", "List not found");
      }

      if (list.owner.toString() !== userId) {
        throw ErrorHandler.createError("UnauthorizedError", "Forbidden error");
      }

      if (list.members.length > 1) {
        throw ErrorHandler.createError(
          "BadRequest",
          "Cannot delete list with members"
        );
      }

      await this.Repository.deleteList(listId);
    } catch (error) {
      throw error;
    }
  }

  public static async addNewProduct(
    listId: string,
    productBody: IProduct,
    userId: string
  ): Promise<IList | null> {
    try {
      const listBody: IList | null = await ListsRepositories.getListById(
        listId
      );

      if (listBody === null)
        throw ErrorHandler.createError("NotFoundError", "List not found");

      const userExistsInList = listBody.members.some(
        (member) => String(member.userId) === userId
      );

      if (!userExistsInList)
        throw ErrorHandler.createError(
          "NotFoundError",
          `User doesn't belong to list with Id ${listId}`
        );

      const updatedList = await this.Repository.addNewProduct(
        listId,
        productBody
      );

      return updatedList;
    } catch (error) {
      throw error;
    }
  }

  public static async addNewMember(
    listId: string,
    username: string,
    ownerId: string
  ): Promise<IList | null> {
    try {
      const listBody: IList | null = await ListsRepositories.getListById(
        listId
      );

      if (listBody === null)
        throw ErrorHandler.createError("NotFoundError", "List not found");

      if (String(listBody.owner) !== ownerId) {
        throw ErrorHandler.createError(
          "UnauthorizedError",
          "User is not the owner of the list"
        );
      }

      const user: IUser | null = await UsersRepositories.getUserByUsername(
        username
      );

      if (user === null)
        throw ErrorHandler.createError("NotFoundError", "User not found");

      const userExistsInList = listBody.members.some(
        (member) => String(member.userId) === String(user._id)
      );

      if (userExistsInList)
        throw ErrorHandler.createError(
          "Conflict",
          `User already belongs to list with Id ${listId}`
        );

      const updatedList = await this.Repository.addNewMember(
        listId,
        String(user._id)
      );

      return updatedList;
    } catch (error) {
      throw error;
    }
  }

  public static async deleteMemberFromList(
    listId: string,
    memberId: string,
    userId: string
  ): Promise<IUser[] | null> {
    try {
      const listBody: IList | null = await ListsRepositories.getListById(
        listId
      );

      if (listBody === null)
        throw ErrorHandler.createError("NotFoundError", "List not found");

      if (String(listBody.owner) !== userId && memberId !== userId) {
        throw ErrorHandler.createError(
          "UnauthorizedError",
          "User is not the owner of the list"
        );
      }

      const user: IUser | null = await UsersRepositories.getUserById(memberId);

      if (user === null)
        throw ErrorHandler.createError(
          "NotFoundError",
          "Member user not found"
        );

      const userExistsInList = listBody.members.some(
        (member) => String(member.userId) === memberId
      );

      if (!userExistsInList)
        throw ErrorHandler.createError(
          "NotFoundError",
          `User doesn't belong to list with Id ${listId}`
        );

      //try to delete the user's notifications first...
      await NotificationsRepositories.deleteUserListNotifications(
        memberId,
        listId
      );

      const remainingMembers = listBody.members.filter(
        (member) => String(member.userId) !== memberId
      );

      if (remainingMembers.length === 0) {
        await this.Repository.deleteList(listId);
        return null;
      } else if (
        remainingMembers.length !== 0 &&
        memberId === String(listBody.owner)
      ) {
        const nextOwnerId = remainingMembers[0].userId;

        await this.Repository.changeListOwner(
          listId,
          userId,
          String(nextOwnerId)
        );
      }

      const updatedList = await this.Repository.deleteMemberFromList(
        listId,
        memberId
      );

      return updatedList;
    } catch (error) {
      throw error;
    }
  }

  public static async deleteProductFromList(
    listId: string,
    productId: string,
    userId: string
  ): Promise<IList | null> {
    try {
      const listBody: IList | null = await ListsRepositories.getListById(
        listId
      );

      if (listBody === null)
        throw ErrorHandler.createError("NotFoundError", "List not found");

      const userExistsInList = listBody.members.some(
        (member) => String(member.userId) === userId
      );

      if (!userExistsInList)
        throw ErrorHandler.createError(
          "NotFoundError",
          `User doesn't belong to list with Id ${listId}`
        );

      const productExistsInList = listBody.products.some(
        (product) => String(product._id) === productId
      );

      if (!productExistsInList)
        throw ErrorHandler.createError(
          "NotFoundError",
          `Product doesn't exist in list with Id ${listId}`
        );

      const updatedList = await this.Repository.deleteProductFromList(
        listId,
        productId
      );

      return updatedList;
    } catch (error) {
      throw error;
    }
  }

  public static async invertProductCheck(
    listId: string,
    productId: string,
    userId: string
  ): Promise<IList | null> {
    try {
      const listBody: IList | null = await ListsRepositories.getListById(
        listId
      );

      if (listBody === null)
        throw ErrorHandler.createError("NotFoundError", "List not found");

      const userExistsInList = listBody.members.some(
        (member) => String(member.userId) === userId
      );

      if (!userExistsInList)
        throw ErrorHandler.createError(
          "NotFoundError",
          `User doesn't belong to list with Id ${listId}`
        );

      const product = listBody.products.find(
        (product) => String(product._id) === productId
      );

      if (!product)
        throw ErrorHandler.createError(
          "NotFoundError",
          `Product doesn't exist in list with Id ${listId}`
        );
      const newCheckValue = !product.checked;

      const updatedList = await this.Repository.invertProductCheck(
        listId,
        productId,
        newCheckValue
      );

      return updatedList;
    } catch (error) {
      throw error;
    }
  }

  public static async updateProductInfo(
    listId: string,
    productId: string,
    userId: string,
    newProductInfo: IProduct
  ): Promise<IList | null> {
    try {
      const listBody: IList | null = await ListsRepositories.getListById(
        listId
      );

      if (listBody === null)
        throw ErrorHandler.createError("NotFoundError", "List not found");

      const userExistsInList = listBody.members.some(
        (member) => String(member.userId) === userId
      );

      if (!userExistsInList)
        throw ErrorHandler.createError(
          "NotFoundError",
          `User doesn't belong to list with Id ${listId}`
        );

      const product = listBody.products.find(
        (product) => String(product._id) === productId
      );

      if (!product)
        throw ErrorHandler.createError(
          "NotFoundError",
          `Product doesn't exist in list with Id ${listId}`
        );

      const updatedList = await this.Repository.updateProductInfo(
        listId,
        productId,
        newProductInfo
      );

      return updatedList;
    } catch (error) {
      throw error;
    }
  }

  public static async searchProducts(searchTerm: string, userId: string) {
    try {
      const user: IUser | null = await UsersRepositories.getUserById(userId);

      if (user === null)
        throw ErrorHandler.createError(
          "NotFoundError",
          "Member user not found"
        );

      const matchedProducts = await this.Repository.searchListsWithProducts(
        searchTerm,
        userId
      );

      const latestProducts: IProduct[] = [];

      matchedProducts.forEach((product) => {
        if (
          !latestProducts.find(
            (p) => p.name === product.name && p.market === product.market
          )
        ) {
          latestProducts.push(product);
        }
      });
      return latestProducts;
    } catch (error) {
      throw error;
    }
  }
}
