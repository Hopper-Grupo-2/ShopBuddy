import { Router } from "express";
import authenticate from "../middlewares/authentication";
import NotificationsController from "../controllers/notifications";

const notificationsRouter = Router();

// GET /api/notifications - gets the latest notifications for the user
notificationsRouter.get(
  "/",
  authenticate,
  NotificationsController.getListNotifications
);

export { notificationsRouter };
