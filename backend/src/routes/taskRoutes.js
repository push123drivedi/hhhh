import express from "express";
import { assignTask, getTasks, markRoom, markTask, recommendTasks, startTask } from "../controllers/taskController.js";
import { allowRoles, protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();
router.get("/", protect, asyncHandler(getTasks));
router.post("/recommend", protect, allowRoles("admin", "supervisor"), asyncHandler(recommendTasks));
router.patch("/:id/assign", protect, allowRoles("admin", "supervisor"), asyncHandler(assignTask));
router.patch("/:id/start", protect, allowRoles("admin", "supervisor"), asyncHandler(startTask));
router.patch("/:id/verify", protect, allowRoles("admin", "supervisor"), asyncHandler(markTask));
router.patch("/room/:roomId/verify", protect, allowRoles("admin", "supervisor"), asyncHandler(markRoom));
export default router;
