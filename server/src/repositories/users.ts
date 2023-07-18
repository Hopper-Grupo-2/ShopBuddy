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
			const user = await this.Model.findOne({ email });
			return user ? user.toJSON() : null;
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
			const user = await this.Model.findOne({ username });
			return user ? user.toJSON() : null;
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
			const response = await this.Model.create({
				username: user.username,
				email: user.email,
				password: user.password,
				firstName: user.firstName,
				lastName: user.lastName,
				createdAt: Date.now(),
				updatedAt: Date.now(),
			});
			const createdUser: IUser = {
				_id: response._id,
				username: response.username,
				email: response.email,
				password: response.password,
				firstName: response.firstName,
				lastName: response.lastName,
				createdAt: response.createdAt,
				updatedAt: response.updatedAt,
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

	// public static async findAllLists(): Promise<IList[] | null> {
	// 	try {
	// 		const lists = await this.Model.find().exec();
	// 		return lists || null;
	// 	} catch (error) {
	// 		console.error(this.name, "getAllLists error:", error);
	// 		throw error;
	// 	}
	// }
}
