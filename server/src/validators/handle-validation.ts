import { Request, Response, NextFunction } from "express";
import { validationResult, Result, ValidationError } from "express-validator";
import ErrorHandler from "../errors";

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

  return res.status(422).json({
    data: null,
    error: ErrorHandler.createError("UnprocessableEntity", errors),
  });
}
