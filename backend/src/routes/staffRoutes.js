import express from "express";
import { createStaff, getAttendance, getStaff, markAttendance, updateStaff } from "../controllers/staffController.js";
import { allowRoles, protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();
router.get("/", protect, asyncHandler(getStaff));
router.post("/", protect, allowRoles("admin"), asyncHandler(createStaff));
router.patch("/:id", protect, allowRoles("admin", "supervisor"), asyncHandler(updateStaff));
router.get("/attendance", protect, asyncHandler(getAttendance));
router.patch("/:staffId/attendance", protect, allowRoles("admin", "supervisor"), asyncHandler(markAttendance));
export default router;
