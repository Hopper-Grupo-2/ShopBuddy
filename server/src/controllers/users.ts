import { NextFunction, Request, Response } from "express";
import UsersServices from "../services/users";
import IUser, { IUserUpdate } from "../interfaces/user";
import jwtLib from "jsonwebtoken";
import ErrorHandler from "../errors";

export default class UsersController {
    public static async getUserAuthentication(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userCredentials = {
                email: req.body.email,
                password: req.body.password,
            };

            const user = await UsersServices.loginUser(
                userCredentials.email,
                userCredentials.password
            );

            const jwt = jwtLib.sign(user, process.env.JWTSECRET || "my secret");

            res.cookie("session", jwt);
            res.status(200).json({
                error: null,
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    public static async registerNewUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const user: IUser = req.body;

            const createdUser = await UsersServices.signupUser(user);
            res.status(200).json({
                error: null,
                data: `User with id ${createdUser._id} registered successfully!`,
            });
        } catch (error) {
            next(error);
        }
    }
    public static async getAllUsers(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const allusers = await UsersServices.getAllUsers();
            res.status(200).json({ error: null, data: allusers });
        } catch (error) {
            next(error);
        }
    }
    public static async getUserById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId: string = req.params.userId;
            const userById: IUser | null = await UsersServices.getUserById(
                userId
            );
            res.status(200).json({ error: null, data: userById });
        } catch (error) {
            next(error);
        }
    }

    public static async updateUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId: string = req.params.userId;

            const {
                username,
                email,
                oldPassword,
                newPassword,
                firstName,
                lastName,
            } = req.body;

            // validar dados de entrada depois se são vazios, o tipo etc

            const user = {
                username,
                email,
                oldPassword,
                newPassword,
                firstName,
                lastName,
            } as IUserUpdate;

            const updatedUser = await UsersServices.updateUser(userId, user);

            res.status(200).json({
                error: null,
                data: `User with id ${updatedUser._id} updated successfully!`,
            });
        } catch (error) {
            next(error);
        }
    }

    public static async deleteUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId: string = req.params.userId;

            const loggedUserId = req.user?._id || "";

            if (userId !== loggedUserId) {
                throw ErrorHandler.createError(
                    "ForbiddenError",
                    `The id of the logged in user does not match the id you are trying to delete`
                );
            }

            const userDeleted: IUser = await UsersServices.deleteUser(userId);

            res.status(200).json({
                error: null,
                data: `User with id ${userId} deleted successfully!`,
            });
        } catch (error) {
            next(error);
        }
    }

    // public static async getLists(
    // 	req: Request,
    // 	res: Response,
    // 	next: NextFunction
    // ): Promise<void> {
    // 	try {
    // 		const allLists = await ListsServices.getAllLists();
    // 		res.status(200).json({ error: null, data: allLists });
    // 	} catch (error) {
    // 		next(error);
    // 	}
    // }
}
