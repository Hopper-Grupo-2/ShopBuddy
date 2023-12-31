import swaggerAutogen from "swagger-autogen";
import { config } from "dotenv";
config();

const env = process.env.NODE_ENV || "dev";
const port = process.env.PORT || "4021";
const host = env === "dev" ? `localhost:${port}` : "45.77.199.234";

const outputFile = "./server/docs/swagger.json";
const endpointsFiles = [
  "./server/src/app.ts",
  "./server/src/validators/handle-validation.ts",
];

const swagger = swaggerAutogen({ language: "pt-BR" });

const doc = {
  info: {
    version: "1.0.0",
    title: "Shopbuddy API",
    language: "en-US",
    description:
      "Documentation automatically generated by the <b>swagger-autogen</b> module.",
  },
  host: host,
  basePath: "/",
  schemes: ["http", "https"],
  /*
  securityDefinitions: {
    sessionAuth: {
      type: "apiKey",
      in: "cookie", // specify that the authentication is in a cookie
      name: "session", // the name of the cookie
    },
  },
  security: [
    { sessionAuth: [] }, // enable this security definition for all endpoints
  ],
  */
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: "User",
      description: "Endpoints to manage users",
    },
    {
      name: "List",
      description: "Endpoints to manage lists/products",
    },
    {
      name: "Message",
      description: "Endpoints to manage messages/chat",
    },
  ],
  definitions: {
    User: {
      _id: "64c65cb75765cdcc8475091e",
      username: "lets",
      email: "lets@alpha.com",
      password: "$2b$10$NQW4IrPTRilLJ3WyGsiifuqgBnoInixCnIfxG47ULUMlrAwxqFCbi",
      firstName: "aqui",
      lastName: "lets",
      createdAt: "2023-07-30T12:51:03.000Z",
      updatedAt: "2023-08-01T00:02:06.068Z",
    },
    User2: {
      _id: "64c69aa800481e5a3547dd3d",
      username: "maria",
      email: "maria@alpha.com",
      password: "$2b$10$IZTtQtrMyy9mKTUhrym7TuhPrp6thovDwvJv3hrj6w.5e4kRxqVpO",
      firstName: "maria",
      lastName: "silva",
      createdAt: "2023-07-30T17:15:20.000Z",
      updatedAt: "2023-07-30T17:15:20.000Z",
    },
    Login: {
      $email: "lets@alpha.com",
      $password: "123",
    },
    LoginValidator: {
      name: "UnprocessableEntity",
      message: [
        "email is mandatory.",
        "email must be between 3 and 50 characters.",
        "Invalid email format.",
        "password is mandatory.",
        "password must be at least 3-16 characters long.",
        "password must contain at least one digit.",
      ],
    },
    Register: {
      $username: "lets",
      $email: "lets@alpha.com",
      $password: "1234",
      $firstName: "letonio",
      $lastName: "fulano",
    },
    RegisterValidator: {
      name: "UnprocessableEntity",
      message: [
        "username is mandatory.",
        "username must be between 3 and 15 characters.",
        "username must contain only letters and digits.",
        "username must be a string.",
        "email is mandatory.",
        "email must be between 3 and 50 characters.",
        "Invalid email format.",
        "password is mandatory.",
        "password must be at least 3-16 characters long.",
        "password must contain at least one digit.",
        "firstName is mandatory.",
        "firstName must be between 3 and 15 characters.",
        "firstName must contain only letters and digits.",
        "firstName must be a string.",
        "lastName is mandatory.",
        "lastName must be between 3 and 15 characters.",
        "lastName must contain only letters and digits.",
        "lastName must be a string.",
      ],
    },
    UserByIdValidator: {
      name: "UnprocessableEntity",
      message: ["The userId must be a valid ObjectId."],
    },
    UpdateUser: {
      $username: "lets",
      $email: "lets@alpha.com",
      $oldPassword: "1234",
      $newPassword: "1234",
      $firstName: "letonio",
      $lastName: "fulano",
    },
    UpdateUserValidator: {
      name: "UnprocessableEntity",
      message: [
        "The userId must be a valid ObjectId.",
        "username is mandatory.",
        "username must be between 3 and 15 characters.",
        "username must contain only letters and digits.",
        "username must be a string.",
        "email is mandatory.",
        "email must be between 3 and 50 characters.",
        "Invalid email format.",
        "oldPassword is mandatory.",
        "oldPassword must be at least 3-16 characters long.",
        "oldPassword must contain at least one digit.",
        "newPassword is mandatory.",
        "newPassword must be at least 3-16 characters long.",
        "newPassword must contain at least one digit.",
        "firstName is mandatory.",
        "firstName must be between 3 and 15 characters.",
        "firstName must contain only letters and digits.",
        "firstName must be a string.",
        "lastName is mandatory.",
        "lastName must be between 3 and 15 characters.",
        "lastName must contain only letters and digits.",
        "lastName must be a string.",
      ],
    },

    RemoveUserValidator: {
      name: "UnprocessableEntity",
      message: ["The userId must be a valid ObjectId."],
    },

    //should always be last definition:
    Error500: {
      name: "InternalServerError",
      message: "original error message is...",
    },
  },
};

swagger(outputFile, endpointsFiles, doc);
