import { Router } from "express";
//import UsersController from "../controllers/users";

const usersRouter = Router();

// GET /api/users/ - get all users (not useful)
// GET /api/user/:userId - get a user by its id

// POST /api/users/signup - create a new authenticated user (do not set up authentication yet)

// PATCH /api/users/:userId - update a user's information

// DELETE /api/lists/:listId - delete a list from a user by list id

// ------ Authentication Routes ------- (to be defined)
// POST /api/users/login - create a new login session (return the authentication token)

export { usersRouter };
