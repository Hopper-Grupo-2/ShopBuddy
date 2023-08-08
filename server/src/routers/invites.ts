import { Router } from "express";
import authenticate from "../middlewares/authentication";
import InvitesController from "../controllers/invites";

const invitesRouter = Router();

// GET /api/invites/:inviteId - join list through invite link
invitesRouter.get(
  "/:inviteId",
  authenticate,
  InvitesController.joinListThroughInvite
);

// POST /api/invites/:listId - create a new invite link
invitesRouter.post("/:listId", authenticate, InvitesController.postInviteLink);

export { invitesRouter };
