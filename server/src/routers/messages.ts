import { Router } from "express";
import authenticate from "../middlewares/authentication";
import MessagesController from "../controllers/messages";
import validate from "../validators/validate";
import handleValidation from "../validators/handle-validation";

const messagesRouter = Router();

// GET /api/messages/ - get all messages (not useful)
messagesRouter.get("/", MessagesController.getAllMessages);
// GET /api/messages/:listId - get all messages in a list chat
messagesRouter.get(
  "/:listId",
  authenticate,
  validate("getMessagesByListId"),
  handleValidation,
  MessagesController.getMessagesByListId
);

// POST /api/messages/:listId - create a new message in a list chat
messagesRouter.post(
  "/:listId",
  authenticate,
  validate("postMessage"),
  handleValidation,
  MessagesController.postMessage
);

export { messagesRouter };
