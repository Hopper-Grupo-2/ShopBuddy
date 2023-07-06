import { Router } from "express";
import ListsController from "../controllers/lists";

const listsRouter = Router();

listsRouter.get("/", ListsController.getLists);

export { listsRouter };
