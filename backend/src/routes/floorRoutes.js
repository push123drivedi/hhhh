import express from "express";
import { getFloors, getSections } from "../controllers/floorController.js";
import { protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();
router.get("/", protect, asyncHandler(getFloors));
router.get("/sections/all", protect, asyncHandler(getSections));
export default router;
