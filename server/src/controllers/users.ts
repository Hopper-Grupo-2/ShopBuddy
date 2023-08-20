import ErrorHandler from "../errors";
import UsersServices from "../services/users";
import jwtLib, { JwtPayload } from "jsonwebtoken";
import IUser, { IUserUpdate } from "../interfaces/user";
import { NextFunction, Request, Response } from "express";
import RedisCaching from "../database/caching/redisCaching";

export default class UsersController {
  public static async getUserAuthentication(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    /*           
      #swagger.tags = ["User"];
      #swagger.description = "Endpoint para autenticar um usuário";
      #swagger.parameters["Login"] = { 
          in: 'body',
          description: 'email e password do usuário',
          schema: { $ref: "#/definitions/Login"}
      }

      #swagger.responses[200] = { schema: { error: 'null', data: {$ref: "#/definitions/User" } } }
      #swagger.responses[401] = #swagger.responses[401] = {
          description: "Autenticação inválida", 
          schema: { "error": { name: "UnauthorizedError", "message": "Incorrect e-mail and/or password"}, "data": 'null' } 
      }
      #swagger.responses[422] = #swagger.responses[422] = {
          description: "Erro de Validação", 
          schema: { "error": { $ref: "#/definitions/LoginValidator"}, "data": 'null' } 
      }
      #swagger.responses[500] = #swagger.responses[500] = {
          description: "Erro interno do servidor", 
          schema: { "error": { $ref: "#/definitions/Error500"}, "data": 'null' } 
      }      
    */

    try {
      const userCredentials = {
        email: req.body.email,
        password: req.body.password,
      };

      const user = await UsersServices.loginUser(
        userCredentials.email,
        userCredentials.password
      );

      const jwt = jwtLib.sign(user, process.env.JWTSECRET || "my secret");

      res.cookie("session", jwt);
      res.status(200).json({
        error: null,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async registerNewUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    /*           
      #swagger.tags = ["User"];
      #swagger.description = "Endpoint para registrar um novo usuário";
      #swagger.parameters["Register"] = { 
          in: 'body',
          description: 'dados para registrar o usuário',
          schema: { $ref: "#/definitions/Register"}
      }

      #swagger.responses[200] = { schema: { error: 'null', data: {$ref: "#/definitions/User" } } }
      #swagger.responses[401] = #swagger.responses[401] = {
          description: "Autenticação inválida", 
          schema: { "error": { name: "UnauthorizedError", "message": "This e-mail is already in use"}, "data": 'null' } 
      }
      #swagger.responses[422] = #swagger.responses[422] = {
          description: "Erro de Validação", 
          schema: { "error": { $ref: "#/definitions/RegisterValidator"}, "data": 'null' } 
      }
      #swagger.responses[500] = #swagger.responses[500] = {
          description: "Erro interno do servidor", 
          schema: { "error": { $ref: "#/definitions/Error500"}, "data": 'null' } 
      }      
    */

    try {
      const user: IUser = req.body;

      const createdUser = await UsersServices.signupUser(user);
      res.status(200).json({
        error: null,
        data: `User with id ${createdUser._id} registered successfully!`,
      });

      // clear cached data about USERS
      await RedisCaching.clearCacheByKeyName("users");
    } catch (error) {
      next(error);
    }
  }
  public static async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    /*           
      #swagger.tags = ["User"];
      #swagger.description = "Endpoint para listar todos os usuários";
      

      #swagger.responses[200] = { schema: { error: 'null', data: [{$ref: "#/definitions/User" }, {$ref: "#/definitions/User2" }] } }
      #swagger.responses[401] = #swagger.responses[401] = {
          description: "Autenticação inválida", 
          schema: { "error": { name: "UnauthorizedError", "message": "Make login first"}, "data": 'null' } 
      }
      #swagger.responses[500] = #swagger.responses[500] = {
          description: "Erro interno do servidor", 
          schema: { "error": { $ref: "#/definitions/Error500"}, "data": 'null' } 
      }      
    */
    try {
      const usersFromCache: IUser[] | null =
        await RedisCaching.getCacheFromKeyValueTypeByKeyname<IUser>("users");

      if (usersFromCache !== null) {
        res.status(200).json({ error: null, data: usersFromCache });
        return;
      }

      const allUsers = await UsersServices.getAllUsers();
      res.status(200).json({ error: null, data: allUsers });

      if (allUsers && allUsers.length > 0) {
        await RedisCaching.setCacheKeyValueType<IUser>("users", allUsers);
      }
    } catch (error) {
      next(error);
    }
  }
  public static async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    /*
      #swagger.tags = ["User"];
      #swagger.description = "Endpoint para recuperar um usuário";

      #swagger.parameters['userId'] = {
          in: 'path',
          description: 'User ID.',
          required: true,
          type: 'string'
      }
      
      #swagger.responses[200] = { schema: { error: 'null', data: {$ref: "#/definitions/User" } } }
      #swagger.responses[401] = #swagger.responses[401] = {
          description: "Autenticação inválida", 
          schema: { "error": { name: "UnauthorizedError", "message": "token is missing or invalid"}, "data": 'null' } 
      }
      #swagger.responses[404] = #swagger.responses[404] = {
          description: "Não encontrado", 
          schema: { "error": { "name": "NotFoundError", "message": "There is no user with the given id" }, "data": 'null' }
      
      }
      #swagger.responses[422] = #swagger.responses[422] = {
          description: "Erro de Validação", 
          schema: { "error": { $ref: "#/definitions/UserByIdValidator"}, "data": 'null' } 
      }
      #swagger.responses[500] = #swagger.responses[500] = {
          description: "Erro interno do servidor", 
          schema: { "error": { $ref: "#/definitions/Error500"}, "data": 'null' } 
      }  

    */

    try {
      const userId: string = req.params.userId;

      const userById: IUser | null = await UsersServices.getUserById(userId);
      res.status(200).json({ error: null, data: userById });
    } catch (error) {
      next(error);
    }
  }

  public static async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    /*           
      #swagger.tags = ["User"];
      #swagger.description = "Endpoint para atualizar os dados de um usuário";
      #swagger.parameters["updateUser"] = { 
          in: 'body',
          description: 'dados para atualizar o usuário',
          schema: { $ref: "#/definitions/UpdateUser"}
      }

      #swagger.responses[200] = { schema: { error: 'null', data: {$ref: "#/definitions/User" } } }
      #swagger.responses[401] = #swagger.responses[401] = {
          description: "Autenticação inválida", 
          schema: { "error": { name: "UnauthorizedError", "message": "token is missing or invalid"}, "data": 'null' } 
      }
      #swagger.responses[403] = #swagger.responses[403] = {
          description: "Proíbido", 
          schema: { "error": { name: "ForbiddenError", "message": "User 64c65cb75765cdcc8475091e does not have access"}, "data": 'null' } 
      }
      #swagger.responses[404] = #swagger.responses[404] = {
          description: "Não encontrado", 
          schema: { "error": { "name": "NotFoundError", "message": "There is no user with the given id" }, "data": 'null' }
      
      }
      #swagger.responses[409] = #swagger.responses[409] = {
          description: "Conflito de dados", 
          schema: { "error": { name: "Conflict", "message": "This e-mail is already in use"}, "data": 'null' } 
      }
      #swagger.responses[422] = #swagger.responses[422] = {
          description: "Erro de Validação", 
          schema: { "error": { $ref: "#/definitions/UpdateUserValidator"}, "data": 'null' } 
      }
      #swagger.responses[500] = #swagger.responses[500] = {
          description: "Erro interno do servidor", 
          schema: { "error": { $ref: "#/definitions/Error500"}, "data": 'null' } 
      }      
    */

    try {
      const userId: string = req.params.userId;

      // id from cookie
      const loggedUserId: string = req.user?._id?.toString() || "";
      const { username, email, oldPassword, newPassword, firstName, lastName } =
        req.body;

      // verify if some error was find into input (params,body,...)
      const errors: string[] = (req.query.errors as string[]) || [];

      if (errors.length > 0) {
        throw ErrorHandler.createError("UnprocessableEntity", errors);
      }

      const user = {
        username,
        email,
        oldPassword,
        newPassword,
        firstName,
        lastName,
      } as IUserUpdate;

      const updatedUser = await UsersServices.updateUser(
        loggedUserId,
        userId,
        user
      );

      res.status(200).json({
        error: null,
        data: updatedUser,
      });

      // clear cached data about USERS
      await RedisCaching.clearCacheByKeyName("users");
    } catch (error) {
      next(error);
    }
  }

  public static async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    /*           
      #swagger.tags = ["User"];
      #swagger.description = "Endpoint para excluir um usuário";
      #swagger.parameters['userId'] = {
          in: 'path',
          description: 'User ID.',
          required: true,
          type: 'string'
      }

      #swagger.responses[200] = { schema: { error: 'null', data: "User with id ${userId} deleted successfully!" } }
      #swagger.responses[401] = #swagger.responses[401] = {
          description: "Autenticação inválida", 
          schema: { "error": { name: "UnauthorizedError", "message": "token is missing or invalid"}, "data": 'null' } 
      }
      #swagger.responses[403] = #swagger.responses[403] = {
          description: "Proíbido", 
          schema: { "error": { name: "ForbiddenError", "message": "User ${userId} does not have access"}, "data": 'null' } 
      }
      #swagger.responses[404] = #swagger.responses[404] = {
          description: "Não encontrado", 
          schema: { "error": { "name": "NotFoundError", "message": "There is no user with the given id" }, "data": 'null' }
      
      }
      #swagger.responses[422] = #swagger.responses[422] = {
          description: "Erro de Validação", 
          schema: { "error": { $ref: "#/definitions/RemoveUserValidator"}, "data": 'null' } 
      }
      #swagger.responses[500] = #swagger.responses[500] = {
          description: "Erro interno do servidor", 
          schema: { "error": { $ref: "#/definitions/Error500"}, "data": 'null' } 
      }      
    */

    try {
      const userId: string = req.params.userId;

      const loggedUserId = req.user?._id || "";

      if (userId !== loggedUserId) {
        throw ErrorHandler.createError(
          "ForbiddenError",
          `The id of the logged in user does not match the id you are trying to delete`
        );
      }

      const userDeleted: IUser = await UsersServices.deleteUser(userId);

      res.status(200).json({
        error: null,
        data: `User with id ${userId} deleted successfully!`,
      });

      // clear cached data about USERS
      await RedisCaching.clearCacheByKeyName("users");
    } catch (error) {
      next(error);
    }
  }

  public static async getMe(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.user;

      res.status(200).json({
        error: null,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;

      if (!user)
        throw ErrorHandler.createError(
          "UnauthorizedError",
          "Token does not contain the user's data"
        );

      const username: string = user.username;

      res.clearCookie("session");
      return res.status(200).json({
        message: `User '${username}' logged out successfully`,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async searchUsersByTerm(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const searchTerm: string = req.params.searchTerm;
      const matchingUsers = await UsersServices.searchUser(searchTerm);
      res.status(200).json({ error: null, data: matchingUsers });
    } catch (error) {
      next(error);
    }
  }

  //
  //
}
