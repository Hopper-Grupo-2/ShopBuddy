import { check } from "express-validator";

export default function userIdValidator() {
    return [
        check("userId")
            .isMongoId()
            .withMessage("The id must be a valid ObjectId."),
    ];
}
