import Models from "../database/models";
import ErrorHandler from "../errors";
import IUser from "../interfaces/user";

export default class UsersRepositories {
  private static Model = Models.getInstance().userModel;

  public static async getUserById(userId: string): Promise<IUser | null> {
    try {
      const response = await this.Model.findOne({ _id: userId });

      if (response === null) return null;

      const user: IUser = {
        _id: response._id,
        username: response.username,
        email: response.email,
        password: response.password,
        firstName: response.firstName,
        lastName: response.lastName,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      };
      return user;
    } catch (error) {
      console.error(this.name, "getUserById error: ", error);
      throw ErrorHandler.createError(
        "InternalServerError",
        "Internal server error"
      );
    }
  }

  public static async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      const response = await this.Model.findOne({ email });

      if (response === null) return null;

      const user: IUser = {
        _id: response._id,
        username: response.username,
        email: response.email,
        password: response.password,
        firstName: response.firstName,
        lastName: response.lastName,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      };
      return user;
    } catch (error) {
      console.error(this.name, "getUserByEmail error: ", error);
      throw ErrorHandler.createError(
        "InternalServerError",
        "Internal server error"
      );
    }
  }

  public static async getUserByUsername(
    username: string
  ): Promise<IUser | null> {
    try {
      const response = await this.Model.findOne({ username });

      if (response === null) return null;

      const user: IUser = {
        _id: response._id,
        username: response.username,
        email: response.email,
        password: response.password,
        firstName: response.firstName,
        lastName: response.lastName,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      };
      return user;
    } catch (error) {
      console.error(this.name, "getUserByUsername error: ", error);
      throw ErrorHandler.createError(
        "InternalServerError",
        "Internal server error"
      );
    }
  }

  public static async createNewUser(user: IUser): Promise<IUser> {
    try {
      const timestamp = Date.now();
      const dateWithoutMS = new Date(Math.floor(timestamp / 1000) * 1000);

      const response: IUser = await this.Model.create({
        username: user.username,
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: dateWithoutMS,
        updatedAt: dateWithoutMS,
      });

      let createdAt = new Date(response.createdAt?.toString() || "");
      let updatedAt = new Date(response.updatedAt?.toString() || "");

      // if (createdAt && updatedAt) {
      //createdAt = new Date(createdAt).toISOString(); //new Date(createdAt.toString());
      //updatedAt = new Date(createdAt).toISOString(); //new Date(updatedAt.toString());
      // }

      const createdUser: IUser = {
        _id: response._id?.toString(),
        username: response.username,
        email: response.email,
        password: response.password,
        firstName: response.firstName,
        lastName: response.lastName,
        createdAt: createdAt?.toISOString(),
        updatedAt: updatedAt?.toISOString(),
      };

      return createdUser;
    } catch (error) {
      console.error(this.name, "createNewUser error: ", error);
      throw ErrorHandler.createError(
        "InternalServerError",
        "Internal server error"
      );
    }
  }

  public static async getUsernameById(userId: string): Promise<string | null> {
    try {
      const user = await UsersRepositories.getUserById(userId);
      return user?.username || null;
    } catch (error) {
      console.error(this.name, "getUsernameById error: ", error);
      throw ErrorHandler.createError(
        "InternalServerError",
        "Error getting username by ID"
      );
    }
  }

  public static async getAllUsers() {
    try {
      const response = await this.Model.find();
      const allUsers: IUser[] = [];
      response.forEach((user) => {
        allUsers.push({
          _id: user._id,
          username: user.username,
          email: user.email,
          password: user.password,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        });
      });
      return allUsers;
    } catch (error) {
      console.error(this.name, "getAllUsers error", error);
      throw ErrorHandler.createError(
        "InternalServerError",
        "Internal server error"
      );
    }
  }

  public static async updateUser(userId: string, user: IUser): Promise<IUser> {
    try {
      const userData = {
        username: user.username,
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        updatedAt: Date.now(),
      };

      const response = await this.Model.findByIdAndUpdate(userId, userData, {
        new: true,
      });

      if (response) {
        const userUpdated: IUser = {
          _id: response._id,
          username: response.username,
          email: response.email,
          password: response.password,
          firstName: response.firstName,
          lastName: response.lastName,
          updatedAt: response.updatedAt,
        };
        return userUpdated;
      }
      throw ErrorHandler.createError(
        "InternalServerError",
        "User was not updated"
      );
    } catch (error) {
      //console.error(this.name, "updateUser error: ", error);
      throw ErrorHandler.createError(
        "InternalServerError",
        "Internal server error"
      );
    }
  }

  public static async deleteUser(userId: string): Promise<IUser | null> {
    try {
      const response = await this.Model.findByIdAndDelete(userId);

      if (response === null) return null;

      const user: IUser = {
        _id: response._id,
        username: response.username,
        email: response.email,
        password: response.password,
        firstName: response.firstName,
        lastName: response.lastName,
      };
      return user;
    } catch (error) {
      console.error(this.name, "deleteUser error: ", error);
      throw ErrorHandler.createError(
        "InternalServerError",
        "Internal server error"
      );
    }
  }

  public static async searchUsers(searchTerm: string): Promise<IUser[]> {
    try {
      const matchingUsers = await this.Model.find({
        $or: [
          { username: { $regex: searchTerm, $options: "i" } },
          { firstName: { $regex: searchTerm, $options: "i" } },
          { lastName: { $regex: searchTerm, $options: "i" } },
          {
            $expr: {
              $regexMatch: {
                input: { $concat: ["$firstName", "$lastName"] },
                regex: searchTerm,
                options: "i",
              },
            },
          },
        ],
      });

      return matchingUsers;
    } catch (error) {
      console.error(this.name, "searchUsers error: ", error);
      throw ErrorHandler.createError(
        "InternalServerError",
        `Error searching for the term ${searchTerm}`
      );
    }
  }
}
