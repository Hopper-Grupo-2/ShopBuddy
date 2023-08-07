import Models from "../database/models";
import ErrorHandler from "../errors";
import IInvite from "../interfaces/invite";

export default class InvitesRepositories {
  public static Model = Models.getInstance().inviteModel;

  public static async createInviteLink(
    listId: string,
    userId: string
  ): Promise<IInvite> {
    try {
      await this.Model.findOneAndDelete({ listId: listId });

      const inviteLink = await this.Model.create({
        listId: listId,
        userId: userId,
        createdAt: Date.now(),
      });

      return inviteLink;
    } catch (error) {
      throw ErrorHandler.createError(
        "InternalServerError",
        `Error creating invite link for list ${listId}`
      );
    }
  }

  public static async findInvite(inviteId: string): Promise<IInvite | null> {
    try {
      const invite = await this.Model.findOne({ _id: inviteId });
      return invite;
    } catch (error) {
      throw ErrorHandler.createError(
        "InternalServerError",
        `Error finding invite with id ${inviteId}`
      );
    }
  }
}
