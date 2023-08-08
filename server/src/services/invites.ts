import ErrorHandler from "../errors";
import IInvite from "../interfaces/invite";
import IList from "../interfaces/list";
import IUser from "../interfaces/user";
import InvitesRepositories from "../repositories/invites";
import ListsRepositories from "../repositories/lists";
import UsersRepositories from "../repositories/users";

export default class InvitesServices {
  private static Repository = InvitesRepositories;

  public static async createInviteLink(listId: string, userId: string) {
    try {
      const list: IList | null = await ListsRepositories.getListById(listId);

      if (list === null)
        throw ErrorHandler.createError("NotFoundError", "List not found");

      const user: IUser | null = await UsersRepositories.getUserById(userId);

      if (user === null)
        throw ErrorHandler.createError("NotFoundError", "User not found");

      if (String(list.owner) !== userId) {
        throw ErrorHandler.createError(
          "UnauthorizedError",
          "User is not the owner of the list"
        );
      }

      const inviteLink = this.Repository.createInviteLink(listId, userId);
      return inviteLink;
    } catch (error) {
      throw error;
    }
  }

  public static async addInvitedMember(
    inviteId: string,
    userId: string
  ): Promise<[IList | null, IInvite]> {
    try {
      const invite: IInvite | null = await this.Repository.findInvite(inviteId);

      if (invite === null)
        throw ErrorHandler.createError(
          "Gone",
          "The invite does not exist or has expired"
        );

      const listId = invite.listId.toString();

      const listBody: IList | null = await ListsRepositories.getListById(
        listId
      );

      if (listBody === null)
        throw ErrorHandler.createError("NotFoundError", "List not found");

      const user: IUser | null = await UsersRepositories.getUserById(userId);

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

      const updatedList = await ListsRepositories.addNewMember(listId, userId);

      return [updatedList, invite];
    } catch (error) {
      throw error;
    }
  }
}
