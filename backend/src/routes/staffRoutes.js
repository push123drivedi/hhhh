import express from "express";
import { 
  createStaff, 
  getAttendance, 
  getStaff, 
  markAttendance, 
  updateStaff 
} from "../controllers/staffController.js";
import { allowRoles, protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

// ✅ Specific routes पहले, फिर generic
router.get("/attendance", protect, asyncHandler(getAttendance));
router.patch("/:staffId/attendance", protect, allowRoles("admin", "supervisor"), asyncHandler(markAttendance));

// Generic routes बाद में
router.get("/", protect, asyncHandler(getStaff));
router.post("/", protect, allowRoles("admin"), asyncHandler(createStaff));
router.patch("/:id", protect, allowRoles("admin", "supervisor"), asyncHandler(updateStaff));

export default router;
