import { check } from "express-validator";

export default function validate(route: string) {
  switch (route) {
    case "getUserById":
      return [
        check("userId")
          .isMongoId()
          .withMessage("The id must be a valid ObjectId."),
      ];
  }

  return [];
}

/*
  return [
    check("username")
      .trim()
      .escape()
      .isString()
      .notEmpty()
      .withMessage("username is mandatory.")
      .isLength({ min: 3, max: 15 })
      .withMessage("username must be between 3 and 15 characters.")
      .matches(/^[a-zA-Zà-úÀ-Ú0-9 ]+$/)
      .withMessage("username must contain only letters and digits.")
      .isString()
      .withMessage("username must be a string."),
    check("firstName")
      .trim()
      .escape()
      .isString()
      .notEmpty()
      .withMessage("firstName is mandatory.")
      .isLength({ min: 3, max: 15 })
      .withMessage("firstName must be between 3 and 15 characters.")
      .matches(/^[a-zA-Zà-úÀ-Ú0-9 ]+$/)
      .withMessage("firstName must contain only letters and digits.")
      .isString()
      .withMessage("firstName must be a string."),
    check("lastName")
      .trim()
      .escape()
      .isString()
      .notEmpty()
      .withMessage("lastName is mandatory.")
      .isLength({ min: 3, max: 15 })
      .withMessage("lastName must be between 3 and 15 characters.")
      .matches(/^[a-zA-Zà-úÀ-Ú0-9 ]+$/)
      .withMessage("lastName must contain only letters and digits.")
      .isString()
      .withMessage("lastName must be a string."),
    check("email")
      .trim()
      .notEmpty()
      .withMessage("Email is mandatory.")
      .isLength({ min: 3, max: 50 })
      .withMessage("Email must be between 3 and 50 characters.")
      .matches(/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/)
      .withMessage("Invalid email format."),
    check("oldPassword")
      .trim()
      .notEmpty()
      .withMessage("oldPassword is mandatory.")
      .isLength({ min: 3, max: 16 })
      .withMessage("oldPassword must be at least 3-16 characters long.")
      //.matches(/[a-zA-Z]/)
      //.withMessage("oldPassword must contain at least one letter.")
      .matches(/[0-9]/)
      .withMessage("oldPassword must contain at least one digit."),
    check("newPassword")
      .trim()
      .notEmpty()
      .withMessage("newPassword is mandatory.")
      .isLength({ min: 3, max: 16 })
      .withMessage("newPassword must be at least 3-16 characters long.")
      //.matches(/[a-zA-Z]/)
      //.withMessage("oldPassword must contain at least one letter.")
      .matches(/[0-9]/)
      .withMessage("newPassword must contain at least one digit."),
  ];
}
*/
