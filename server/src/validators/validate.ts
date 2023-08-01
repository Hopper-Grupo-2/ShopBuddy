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

      default:
        return check(fieldTitle).trim().notEmpty();
    }
  });

  return validationsChain;
}
