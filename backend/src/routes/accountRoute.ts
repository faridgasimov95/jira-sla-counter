import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import {
  changePassword,
  deleteAccount,
} from "../controllers/accountController";

/**
 * Route for Account Management
 * PATCH api/account/patch - change user password.
 * DELETE api/auth/sign-in - delete user account.
 */
const router = Router();

router.patch("/", requireAuth, changePassword);
router.delete("/", requireAuth, deleteAccount);

export default router;
