import { Router } from "express";
import {
  getHistory,
  downloadFile,
  deleteFile,
} from "../controllers/historyController";
import { requireAuth } from "../middlewares/authMiddleware";

/**
 * Route for Authentication
 * POST api/auth/sign-up - register a new user.
 * POST api/auth/sign-in - sign in an existing user.
 */
const router = Router();

router.get("/", requireAuth, getHistory);
router.get("/:id/download", requireAuth, downloadFile);
router.delete("/:id", requireAuth, deleteFile);

export default router;
