import ErrorHandler from "../errors";
import IUser from "../interfaces/user";
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

	// public static async getAllLists(): Promise<IList[] | null> {
	// 	try {
	// 		const lists = await this.Repository.findAllLists();
	// 		return lists || null;
	// 	} catch (error) {
	// 		throw error;
	// 	}
	// }
}
