import { Router } from "express";
import authenticate from "../middlewares/authentication";
import MessagesController from "../controllers/messages";
import validate from "../validators/validate";
import handleValidation from "../validators/handle-validation";
import RedisCaching from "../database/caching/redisCaching";

const cacheRouter = Router();

// DELETE /api/cache/ - delete all data in cache
cacheRouter.delete("/clear-all-cache", MessagesController.getAllMessages);

export { cacheRouter };
