import { Router } from "express";
import { upload } from "../middlewares/uploadMiddleware";
import { processFile } from "../controllers/slaController";

/**
 * Route for SLA processing
 */
const router = Router();
router.post("/process", upload.single("file"), processFile);
export default router;
