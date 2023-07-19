import { Router } from "express";
import ListsController from "../controllers/lists";
import authenticate from "../middlewares/authentication";

const listsRouter = Router();

// GET /api/lists/ - get all lists from all users (not useful)
listsRouter.get("/", ListsController.getLists);

// GET /api/lists/:userId - get all lists from a user by user id
// GET /api/lists/:listId - get a list by list id

// POST /api/lists - add a new list
listsRouter.post("/", authenticate, ListsController.postList);

// PATCH /api/lists/:listId/products - update the products on a list
listsRouter.patch(
  "/:listId/products",
  authenticate,
  ListsController.patchProduct
);
// PATCH /api/lists/:listId/members - update the members on a list

// DELETE /api/lists/:listId - delete a list from a user by list id
listsRouter.delete("/:listId", authenticate, ListsController.deleteList);

export { listsRouter };
