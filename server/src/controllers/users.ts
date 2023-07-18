import { NextFunction, Request, Response } from "express";
import UsersServices from "../services/users";
import IUser from "../interfaces/user";
import jwtLib from "jsonwebtoken";

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
				data: `User with id ${createdUser._id} registered succesfully!`,
			});
		} catch (error) {
			next(error);
		}
	}
	public static async getAllUsers(req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const allusers = await UsersServices.getAllUsers();
			res.status(200).json({error: null, data: allusers})

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
