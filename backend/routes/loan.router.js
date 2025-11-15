import express from "express";
import {
  applyLoan,
  getLoanStatus,
  evaluateLoanHandler,
  getMyLoans,
} from "../controllers/loan.controller.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protected routes
router.post("/apply", authenticateUser, applyLoan);
router.get("/:id/status", authenticateUser, getLoanStatus);

// Optional — manually trigger eligibility evaluation (for admin/officer testing)
router.post("/:id/evaluate", authenticateUser, evaluateLoanHandler);
router.get("/my-loans", authenticateUser, getMyLoans);

export default router;
