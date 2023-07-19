import { Request, Response, NextFunction } from "express";
import { validationResult, Result, ValidationError } from "express-validator";
//////import IResult from "../interfaces/iresult";

export default function handleValidation(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result: Result<any> = validationResult(req);

    if (result.isEmpty()) {
        return next();
    }

    const validationErrors: ValidationError[] = result.array();

    const errors: string[] = [];
    validationErrors.map((err) => {
        errors.push(`${err.msg}`);
    });

    // validationErrors.map((err) => {
    ///     if (err.type === "field") {
    ///         errors.push(`[${err.path}]: ${err.msg}`);
    ///     }
    //  });
    ///const result: IResult<any> = { errors };
    return res.status(422).json({ result: errors });
}

/*
{
    "type": "field",
    "value": "Le",
    "msg": "usarname must be between 3 and 15 character.",
    "path": "username",
    "location": "body"
        }
*/
