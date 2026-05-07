import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { getSettings, updateSettings } from "../controllers/settingsController";

/**
 * Route for User Settings
 * POST api/settings/get - fetch user settings.
 * POST api/settings/update - update user settings.
 */
const router = Router();

router.get("/", requireAuth, getSettings);
router.put("/", requireAuth, updateSettings);

export default router;
