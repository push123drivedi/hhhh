import express from "express";
import { dashboard } from "../controllers/dashboardController.js";
import { protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();
router.get("/", protect, asyncHandler(dashboard));
export default router;
