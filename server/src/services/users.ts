import ErrorHandler from "../errors";
import IUser, { IUserUpdate } from "../interfaces/user";
import UsersRepositories from "../repositories/users";
import bcrypt from "bcrypt";

export default class UsersServices {
    private static Repository = UsersRepositories;

    public static async loginUser(
        email: string,
        plainTextPassword: string
    ): Promise<IUser> {
        try {
            const user: IUser | null = await this.Repository.getUserByEmail(
                email
            );

            if (user === null)
                throw ErrorHandler.createError(
                    "UnauthorizedError",
                    "Incorrect e-mail and/or password"
                );

            if (await bcrypt.compare(plainTextPassword, user.password)) {
                return user;
            } else {
                throw ErrorHandler.createError(
                    "UnauthorizedError",
                    "Incorrect e-mail and/or password"
                );
            }
        } catch (error) {
            throw error;
        }
    }

    public static async signupUser(user: IUser) {
        try {
            const foundUserByEmail = await this.Repository.getUserByEmail(
                user.email
            );
            if (foundUserByEmail !== null)
                throw ErrorHandler.createError(
                    "UnauthorizedError",
                    "This e-mail is already in use"
                );

            const foundUserByUsername = await this.Repository.getUserByUsername(
                user.username
            );
            if (foundUserByUsername !== null)
                throw ErrorHandler.createError(
                    "UnauthorizedError",
                    "This username is already in use"
                );

            const passwordHash = await bcrypt.hash(user.password, 10);
            const newUser: IUser = {
                ...user,
                password: passwordHash,
            };

            const createdUser = await this.Repository.createNewUser(newUser);
            return createdUser;
        } catch (error) {
            throw error;
        }
    }

    public static async getAllUsers(): Promise<IUser[]> {
        try {
            const allUsers = await this.Repository.getAllUsers();
            return allUsers;
        } catch (error) {
            throw error;
        }
    }

    public static async getUserById(userId: string): Promise<IUser | null> {
        try {
            const userById = await this.Repository.getUserById(userId);
            return userById;
        } catch (error) {
            throw error;
        }
    }

    public static async updateUser(
        userId: string,
        user: IUserUpdate
    ): Promise<IUser> {
        try {
            const oldUser = await UsersServices.getUserById(userId);

            if (oldUser === null) {
                throw ErrorHandler.createError(
                    "NotFoundError",
                    "There is no user with the given id"
                );
            }

            if (oldUser._id?.toString() !== userId) {
                throw ErrorHandler.createError(
                    "ForbiddenError",
                    `User ${userId} does not have access`
                );
            }

            const foundUserByEmail = await this.Repository.getUserByEmail(
                user.email
            );
            if (foundUserByEmail !== null && user.email !== oldUser.email)
                throw ErrorHandler.createError(
                    "UnauthorizedError",
                    "This e-mail is already in use"
                );

            const foundUserByUsername = await this.Repository.getUserByUsername(
                user.username
            );

            if (
                foundUserByUsername !== null &&
                user.username !== oldUser.username
            )
                throw ErrorHandler.createError(
                    "UnauthorizedError",
                    "This username is already in use"
                );

            const plainTextPassword = user.oldPassword;
            if (await bcrypt.compare(plainTextPassword, oldUser.password)) {
                const newPasswordHash = await bcrypt.hash(user.newPassword, 10);

                const userInfo: IUser = {
                    ...user,
                    password: newPasswordHash,
                };

                const updatedUser = await this.Repository.updateUser(
                    userId,
                    userInfo
                );
                return updatedUser;
            } else {
                throw ErrorHandler.createError(
                    "UnauthorizedError",
                    "Old password is wrong"
                );
            }
        } catch (error) {
            throw error;
        }
    }

    public static async deleteUser(userId: string): Promise<IUser> {
        try {
            const userdeleted: IUser | null = await this.Repository.deleteUser(
                userId
            );

            if (userdeleted === null) {
                throw ErrorHandler.createError(
                    "NotFoundError",
                    `There is no user with the given id`
                );
            }
            return userdeleted;
        } catch (error) {
            throw error;
        }
    }
}

// public static async getAllLists(): Promise<IList[] | null> {
// 	try {
// 		const lists = await this.Repository.findAllLists();
// 		return lists || null;
// 	} catch (error) {
// 		throw error;
// 	}
// }
