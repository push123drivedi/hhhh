import express from "express";

import {
  createAdmin,
  login,
  me
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);

router.get("/me", me);

router.get("/create-admin", createAdmin);

export default router;
