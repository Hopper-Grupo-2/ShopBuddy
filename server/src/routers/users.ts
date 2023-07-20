import { Router } from "express";
import UsersController from "../controllers/users";
import authenticate from "../middlewares/authentication";
//import UsersController from "../controllers/users";
import userUpdateValidator from "../validators/userUpdateValidator";
import userIdValidator from "../validators/userIdValidator";
import handleValidation from "../validators/handle-validation";
const usersRouter = Router();

// GET /api/users/ - get all users (not useful)
usersRouter.get("/", UsersController.getAllUsers);
// GET /api/users/:userId - get a user by its id
usersRouter.get("/:userId", authenticate,userIdValidator, UsersController.getUserById);
// PATCH /api/users/:userId - update a user's information
usersRouter.patch(
    "/:userId",
    authenticate,
    userIdValidator(),
    userUpdateValidator(),
    handleValidation,
    UsersController.updateUser
);
// DELETE /api/users/:userId - delete a user by user id
usersRouter.delete(
    "/:userId",
    authenticate,
    userIdValidator(),
    handleValidation,
    UsersController.deleteUser
);
// ------ Authentication Routes -------
// POST /api/users/signup - create a new authenticated user
usersRouter.post("/signup", UsersController.registerNewUser);

// POST /api/users/login - create a new login session (return the authentication token)
usersRouter.post("/login", UsersController.getUserAuthentication);

export { usersRouter };
