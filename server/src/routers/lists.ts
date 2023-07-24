import { Router } from "express";
import ListsController from "../controllers/lists";
import authenticate from "../middlewares/authentication";

const listsRouter = Router();

// GET /api/lists/ - get all lists from all users (not useful)
listsRouter.get("/", ListsController.getLists);

// GET /api/lists/:userId - get all lists from a user by user id    #FAZER
listsRouter.get("/user/:userId", ListsController.getListsByUserId);

// GET /api/lists/:listId - get a list by list id    #FAZER
listsRouter.get("/:listId", ListsController.getListByListId);

// POST /api/lists - add a new list
listsRouter.post("/", authenticate, ListsController.postList);

// PATCH /api/lists/:listId/products - update the products on a list
listsRouter.patch(
  "/:listId/products",
  authenticate,
  ListsController.patchProduct
);

// PATCH /api/lists/:listId/members - update the members on a list
listsRouter.patch(
  "/:listId/members",
  authenticate,
  ListsController.patchMembers
);

// DELETE /api/lists/:listId - delete a list from a user by list id
listsRouter.delete("/:listId", authenticate, ListsController.deleteList);

// DELETE /api/lists/:listId/members/:memberId - delete a member from a list
listsRouter.delete(
  "/:listId/members/:memberId",
  authenticate,
  ListsController.deleteMember
);

// DELETE /api/lists/:listId/products/:productId - delete a product from a list
listsRouter.delete(
  "/:listId/products/:productId",
  authenticate,
  ListsController.deleteProduct
);

// PUT /api/lists/:listId/products/:productId - Altera o status de checked para true
listsRouter.put(
  "/:listId/products/:productId",
  authenticate,
  ListsController.putProduct
);

export { listsRouter };
