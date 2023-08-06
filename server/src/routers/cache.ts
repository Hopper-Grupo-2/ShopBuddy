import { Router } from "express";
import ClearCacheController from "../controllers/clearCache";

const cacheRouter = Router();

// DELETE /api/cache/ - delete all data in cache
cacheRouter.delete("/clear-all-cache", ClearCacheController.clearAllCache);

export { cacheRouter };
