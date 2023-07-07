import { Router } from "express";
import ListsController from "../controllers/lists";

const listsRouter = Router();

/* /api/lists/ */
listsRouter.get("/", ListsController.getLists);

export { listsRouter };
