import { Router } from "express";
import UsersController from "../controllers/users";
import authenticate from "../middlewares/authentication";
//import UsersController from "../controllers/users";
import userValidator from "../validators/userValidator";

const usersRouter = Router();

// GET /api/users/ - get all users (not useful)
usersRouter.get("/", UsersController.getAllUsers);
// GET /api/users/:userId - get a user by its id
usersRouter.get("/:userId", authenticate, UsersController.getUserById);
// PATCH /api/users/:userId - update a user's information
usersRouter.patch(
    "/:userId",
    authenticate,
    userValidator,
    UsersController.updateUser
);
// DELETE /api/users/:userId - delete a user by user id
usersRouter.delete("/:userId", authenticate, UsersController.deleteUser);
// ------ Authentication Routes -------
// POST /api/users/signup - create a new authenticated user
usersRouter.post("/signup", UsersController.registerNewUser);

// POST /api/users/login - create a new login session (return the authentication token)
usersRouter.post("/login", UsersController.getUserAuthentication);

export { usersRouter };
