import { Router } from "express";
import authenticate from "../middlewares/authentication";
import MessagesController from "../controllers/messages";
//import MessagesController from "../controllers/messages";

const messagesRouter = Router();

// GET /api/messages/ - get all messages (not useful)
// GET /api/messages/:listId - get all messages in a list chat

// POST /api/messages/:listId - create a new message in a list chat
messagesRouter.post("/:listId", authenticate, MessagesController.postMessage);

export { messagesRouter };
