import { Router } from "express";
import validate from "../validators/validate";
import UsersController from "../controllers/users";
import authenticate from "../middlewares/authentication";
import handleValidation from "../validators/handle-validation";

const usersRouter = Router();

// GET /api/users/me - get the authenticated user
usersRouter.get("/me", authenticate, UsersController.getMe);

// GET /api/users/ - get all users (not useful)
usersRouter.get("/", UsersController.getAllUsers);
// GET /api/users/:userId - get a user by its id
usersRouter.get(
  "/:userId",
  authenticate,
  validate("getUserById"),
  handleValidation,
  UsersController.getUserById
);

// GET /api/users/search/:searchTerm - get products filtered by term
usersRouter.get(
  "/search/:searchTerm",
  authenticate,
  UsersController.searchUsersByTerm
);

// PATCH /api/users/:userId - update a user's information
usersRouter.patch(
  "/:userId",
  authenticate,
  validate("updateUser"),
  handleValidation,
  UsersController.updateUser
);

// DELETE /api/users/logout - logout (delete cookies)
usersRouter.delete("/logout", authenticate, UsersController.logout);

// DELETE /api/users/:userId - delete a user by user id
usersRouter.delete(
  "/:userId",
  authenticate,
  validate("deleteUser"),
  handleValidation,
  UsersController.deleteUser
);
// ------ Authentication Routes -------
// POST /api/users/signup - create a new authenticated user
usersRouter.post(
  "/signup",
  validate("registerNewUser"),
  handleValidation,
  UsersController.registerNewUser
);

// POST /api/users/login - create a new login session (return the authentication token)
usersRouter.post(
  "/login",
  validate("getUserAuthentication"),
  handleValidation,
  UsersController.getUserAuthentication
);

export { usersRouter };
