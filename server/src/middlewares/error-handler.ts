import { NextFunction, Request, Response } from "express";
import Error, { ErrorNames } from "../errors";

export default function handleAllErrors(
	err: unknown,
	req: Request,
	res: Response,
	next: NextFunction
) {
	// if not an application error, respond with internal server error
	if (
		typeof err !== "object" ||
		err === null ||
		!("name" in err) ||
		typeof err.name !== "string" ||
		!Object.keys(Error.errorNameToHttpStatusCode).includes(err.name)
	) {
		res.status(500).json({
			err: Error.createError(
				"InternalServerError",
				`original error message is: ${err}`
			),
			data: null,
		});
		return;
	}

	const httpStatusCode =
		Error.errorNameToHttpStatusCode[err.name as ErrorNames];

	res.status(httpStatusCode).json({
		err: err,
		data: null,
	});
}
