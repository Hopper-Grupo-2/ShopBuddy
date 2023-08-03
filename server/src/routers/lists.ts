import { Router } from "express";
import validate from "../validators/validate";
import ListsController from "../controllers/lists";
import authenticate from "../middlewares/authentication";
import handleValidation from "../validators/handle-validation";

const listsRouter = Router();

// GET /api/lists/ - get all lists from all users (not useful)
listsRouter.get("/", ListsController.getLists);

// GET /api/lists/:userId - get all lists from a user by user id
listsRouter.get(
  "/user/:userId",
  validate("getListsByUserId"),
  handleValidation,
  ListsController.getListsByUserId
);

// GET /api/lists/:listId - get a list by list id
listsRouter.get(
  "/:listId",
  validate("getListByListId"),
  handleValidation,
  ListsController.getListByListId
);

// GET /api/lists/:listId/members - get all members by list id
listsRouter.get(
  "/:listId/members",
  validate("getMembersByListId"),
  handleValidation,
  ListsController.getMembersByListId
);

// POST /api/lists - add a new list
listsRouter.post(
  "/",
  authenticate,
  validate("postList"),
  handleValidation,
  ListsController.postList
);

// PATCH /api/lists/:listId/products - update the products on a list
listsRouter.patch(
  "/:listId/products",
  authenticate,
  validate("patchProduct"),
  handleValidation,
  ListsController.patchProduct
);

// PATCH /api/lists/:listId/members - update the members on a list
listsRouter.patch(
  "/:listId/members",
  authenticate,
  validate("patchMembers"),
  handleValidation,
  ListsController.patchMembers
);

// DELETE /api/lists/:listId - delete a list from a user by list id
listsRouter.delete(
  "/:listId",
  authenticate,
  validate("deleteList"),
  handleValidation,
  ListsController.deleteList
);

// DELETE /api/lists/:listId/members/:memberId - delete a member from a list
listsRouter.delete(
  "/:listId/members/:memberId",
  authenticate,
  validate("deleteMember"),
  handleValidation,
  ListsController.deleteMember
);

// DELETE /api/lists/:listId/products/:productId - delete a product from a list
listsRouter.delete(
  "/:listId/products/:productId",
  authenticate,
  validate("deleteProduct"),
  handleValidation,
  ListsController.deleteProduct
);

// PUT /api/lists/:listId/products/:productId - Altera o status de checked para true
listsRouter.put(
  "/:listId/products/:productId",
  authenticate,
  validate("putProduct"),
  handleValidation,
  ListsController.putProduct
);

// PATCH /api/lists/:listId/products/:productId - update info of a product in a list
listsRouter.patch(
  "/:listId/products/:productId",
  authenticate,
  validate("patchProductInfo"),
  handleValidation,
  ListsController.patchProductInfo
);

export { listsRouter };
