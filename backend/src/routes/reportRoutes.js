import express from "express";
import { generateDailyReport, getReports } from "../controllers/reportController.js";
import { allowRoles, protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();
router.get("/", protect, asyncHandler(getReports));
router.post("/generate", protect, allowRoles("admin", "supervisor"), asyncHandler(generateDailyReport));
export default router;
