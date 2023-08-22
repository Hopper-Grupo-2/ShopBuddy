import { ValidationChain, check } from "express-validator";

const allFieldsToValidate: {
  [key: string]: { title: string; type: string }[];
} = {
  getUserById: [{ title: "userId", type: "mongoid" }],
  updateUser: [
    { title: "userId", type: "mongoid" },
    { title: "username", type: "name" },
    { title: "firstName", type: "name" },
    { title: "lastName", type: "name" },
    { title: "email", type: "email" },
    { title: "oldPassword", type: "pass" },
    { title: "newPassword", type: "pass" },
  ],
  deleteUser: [{ title: "userId", type: "mongoid" }],
  registerNewUser: [
    { title: "username", type: "name" },
    { title: "firstName", type: "name" },
    { title: "lastName", type: "name" },
    { title: "email", type: "email" },
    { title: "password", type: "pass" },
  ],
  getUserAuthentication: [
    { title: "email", type: "email" },
    { title: "password", type: "pass" },
  ],
  getMessagesByListId: [{ title: "listId", type: "mongoid" }],
  postMessage: [
    { title: "listId", type: "mongoid" },
    { title: "textContent", type: "message" },
  ],
  getListsByUserId: [{ title: "userId", type: "mongoid" }],
  getListByListId: [{ title: "listId", type: "mongoid" }],
  getMembersByListId: [{ title: "listId", type: "mongoid" }],
  postList: [{ title: "listName", type: "list" }],
  patchProduct: [
    { title: "listId", type: "mongoid" },
    { title: "name", type: "list" },
    { title: "quantity", type: "float" },
    { title: "unit", type: "measureunit" },
    { title: "price", type: "float" },
    { title: "market", type: "optional-name" },
    { title: "checked", type: "boolean" },
  ],
  patchMembers: [
    { title: "listId", type: "mongoid" },
    { title: "username", type: "name" },
  ],
  deleteList: [{ title: "listId", type: "mongoid" }],
  deleteMember: [
    { title: "listId", type: "mongoid" },
    { title: "memberId", type: "mongoid" },
  ],
  deleteProduct: [
    { title: "listId", type: "mongoid" },
    { title: "productId", type: "mongoid" },
  ],
  putProduct: [
    { title: "listId", type: "mongoid" },
    { title: "productId", type: "mongoid" },
  ],
  patchProductInfo: [
    { title: "listId", type: "mongoid" },
    { title: "productId", type: "mongoid" },
    { title: "name", type: "list" },
    { title: "quantity", type: "float" },
    { title: "unit", type: "measureunit" },
    { title: "price", type: "float" },
    { title: "market", type: "optional-name" },
  ],
};

export default function validate(route: string) {
  let validationsChain: ValidationChain[] = [];

  if (allFieldsToValidate.hasOwnProperty(route)) {
    const fieldsToValidate: { title: string; type: string }[] =
      allFieldsToValidate[route];

    validationsChain = getAllValidations(fieldsToValidate);
  }

  return validationsChain;
}

function getAllValidations(
  fieldsToValidate: { title: string; type: string }[]
): ValidationChain[] {
  //
  const validationsChain: ValidationChain[] = fieldsToValidate.map((field) => {
    const fieldTitle = field.title;
    const fieldType = field.type;

    switch (fieldType) {
      case "mongoid":
        return check(fieldTitle)
          .isMongoId()
          .withMessage(`The ${fieldTitle} must be a valid ObjectId.`);

      case "name":
        return check(fieldTitle)
          .trim()
          .escape()
          .isString()
          .notEmpty()
          .withMessage(`${fieldTitle} is mandatory.`)
          .isLength({ min: 3, max: 15 })
          .withMessage(`${fieldTitle} must be between 3 and 15 characters.`)
          .matches(/^[a-zA-Zà-úÀ-Ú0-9 ]+$/)
          .withMessage(`${fieldTitle} must contain only letters and digits.`)
          .isString()
          .withMessage(`${fieldTitle} must be a string.`);

      case "pass":
        return (
          check(fieldTitle)
            .trim()
            .notEmpty()
            .withMessage(`${fieldTitle} is mandatory.`)
            .isLength({ min: 3, max: 16 })
            .withMessage(`${fieldTitle} must be at least 3-16 characters long.`)
            //.matches(/[a-zA-Z]/)
            //.withMessage("${fieldType} must contain at least one letter.")
            .matches(/[0-9]/)
            .withMessage(`${fieldTitle} must contain at least one digit.`)
        );

      case "email":
        return check(fieldTitle)
          .trim()
          .notEmpty()
          .withMessage(`${fieldTitle} is mandatory.`)
          .isLength({ min: 3, max: 50 })
          .withMessage(`${fieldTitle} must be between 3 and 50 characters.`)
          .matches(/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/)
          .withMessage("Invalid email format.");

      case "message":
        return check(fieldTitle)
          .trim()
          .escape()
          .isString()
          .notEmpty()
          .withMessage(`${fieldTitle} is mandatory.`)
          .isLength({ min: 1, max: 240 })
          .withMessage(`${fieldTitle} must be between 1 and 240 characters.`)
          .isString()
          .withMessage(`${fieldTitle} must be a string.`);

      case "list":
        return check(fieldTitle)
          .trim()
          .escape()
          .isString()
          .notEmpty()
          .withMessage(`${fieldTitle} is mandatory.`)
          .isLength({ min: 3, max: 30 })
          .withMessage(`${fieldTitle} must be between 3 and 30 characters.`)
          .isString()
          .withMessage(`${fieldTitle} must be a string.`);

      case "integer":
        return check(fieldTitle)
          .trim()
          .notEmpty()
          .withMessage(`${fieldTitle} is mandatory.`)
          .isInt({ min: 1, max: 150 })
          .withMessage(`${fieldTitle} must be an integer between 1 and 150.`);

      case "float":
        return check(fieldTitle)
          .trim()
          .notEmpty()
          .withMessage(`${fieldTitle} is mandatory.`)
          .isFloat({ min: 0 })
          .withMessage(`${fieldTitle} must be a positive number.`);

      case "measureunit":
        return check(fieldTitle)
          .trim()
          .escape()
          .isString()
          .notEmpty()
          .withMessage(`${fieldTitle} is mandatory.`)
          .isLength({ min: 1, max: 50 })
          .withMessage(`${fieldTitle} must be between 1 and 50 characters.`)
          .isString()
          .withMessage(`${fieldTitle} must be a string.`);

      case "boolean":
        return check(fieldTitle)
          .trim()
          .notEmpty()
          .withMessage(`${fieldTitle} is mandatory.`)
          .isBoolean()
          .withMessage(`${fieldTitle} must be a boolean value.`)
          .toBoolean();

      case "optional-name":
        return check(fieldTitle)
          .trim()
          .escape()
          .isString()
          .isLength({ max: 50 })
          .withMessage(`${fieldTitle} must have less than 50 characters.`)
          .isString()
          .withMessage(`${fieldTitle} must be a string.`);

      default:
        return check(fieldTitle).trim().notEmpty();
    }
  });

  return validationsChain;
}
