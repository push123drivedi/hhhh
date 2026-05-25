import express from "express";
import { getRoom, getRooms, updateRoom } from "../controllers/roomController.js";
import { allowRoles, protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();
router.get("/", protect, asyncHandler(getRooms));
router.get("/:id", protect, asyncHandler(getRoom));
router.patch("/:id", protect, allowRoles("admin", "supervisor"), asyncHandler(updateRoom));
export default router;
