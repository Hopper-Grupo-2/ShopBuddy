import { Router } from "express";
import UsersController from "../controllers/users";
//import UsersController from "../controllers/users";

const usersRouter = Router();

// GET /api/users/ - get all users (not useful)
usersRouter.get("/", UsersController.getAllUsers)
// GET /api/users/:userId - get a user by its id
usersRouter.get("/:userId", UsersController.getUserById)
// PATCH /api/users/:userId - update a user's information

// DELETE /api/lists/:listId - delete a list from a user by list id

// ------ Authentication Routes -------
// POST /api/users/signup - create a new authenticated user
usersRouter.post("/signup", UsersController.registerNewUser);

// POST /api/users/login - create a new login session (return the authentication token)
usersRouter.post("/login", UsersController.getUserAuthentication);

export { usersRouter };
