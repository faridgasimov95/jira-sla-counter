import { Router } from "express";
import { upload } from "../middlewares/uploadMiddleware";
import { requireAuth } from "../middlewares/authMiddleware";
import { processFile } from "../controllers/slaController";

/**
 * Route for SLA processing
 */
const router = Router();
router.post("/process", requireAuth, upload.single("file"), processFile);
export default router;
