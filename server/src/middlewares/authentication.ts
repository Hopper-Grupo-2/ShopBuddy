import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import ErrorHandler from "../errors";
import AuthRequest from "../interfaces/auth-request";

export default function authenticate(
	req: AuthRequest,
	res: Response,
	next: NextFunction
) {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(401).json({
			error: ErrorHandler.createError(
				"UnauthorizedError",
				"token is missing or invalid"
			),
			data: null,
		});
	}

	const token = authHeader.split(" ")[1];
	if (!token) {
		return res.status(401).json({
			error: ErrorHandler.createError(
				"UnauthorizedError",
				"token is missing or invalid"
			),
			data: null,
		});
	}

	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET || ""
		) as JwtPayload;
		req.user = {
			_id: decoded.id,
			username: decoded.username as string,
			password: decoded.password as string,
			email: decoded.email as string,
			firstName: decoded.firstName as string,
			lastName: decoded.lastName as string,
			createdAt: decoded.createdAt as Date,
			updatedAt: decoded.updatedAt as Date,
		};

		next();
	} catch (error) {
		return res.status(401).json({
			error: ErrorHandler.createError(
				"UnauthorizedError",
				"token is missing or invalid"
			),
			data: null,
		});
	}
}
