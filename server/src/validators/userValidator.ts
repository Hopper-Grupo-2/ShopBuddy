import { Request, Response, NextFunction } from "express";
import Validator from "./validator";

export default function userValidator(
    req: Request,
    res: Response,
    next: NextFunction
) {
    let errors: string[] = (req.query.errors as string[]) || [];
    const {
        username,
        firstName,
        lastName,
        email,
        password,
        oldPassword,
        newPassword,
    } = req.body;

    if (username) {
        errors = [...errors, ...Validator.isValidName(username, "username")];
    }

    if (email) {
        errors = [...errors, ...Validator.isValidEmail(email)];
    }

    if (firstName) {
        errors = [...errors, ...Validator.isValidName(firstName, "firstName")];
    }

    if (lastName) {
        errors = [...errors, ...Validator.isValidName(lastName, "lastName")];
    }

    if (password) {
        errors = [
            ...errors,
            ...Validator.isValidPassword(password, "password"),
        ];
    }

    if (newPassword) {
        errors = [
            ...errors,
            ...Validator.isValidPassword(newPassword, "newPassword"),
        ];
    }

    if (oldPassword) {
        errors = [
            ...errors,
            ...Validator.isValidPassword(oldPassword, "oldPassword"),
        ];
    }

    req.query.errors = errors;

    next();
}
