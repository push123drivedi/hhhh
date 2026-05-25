import express from "express";
import { getNotifications } from "../controllers/notificationController.js";
import { protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();
router.get("/", protect, asyncHandler(getNotifications));
export default router;
