import { Router } from "express";
import { signUp, signIn } from "../controllers/authController";

/**
 * Route for Authentication
 * POST api/auth/sign-up - register a new user.
 * POST api/auth/sign-in - sign in an existing user.
 */
const router = Router();

router.post("/sign-up", signUp);
router.post("/sign-in"), signIn;

export default router;
