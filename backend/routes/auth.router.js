import express from "express";
import {
  register,
  login,
  getProfile,
  logout,
} from "../controllers/auth.controller.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Protected
router.get("/profile", authenticateUser, getProfile);
router.get("/logout", authenticateUser, logout);

export default router;
