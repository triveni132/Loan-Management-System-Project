import express from "express";
import {
  getPendingLoans,
  reviewLoan,
} from "../controllers/officer.controller.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Only Officers can access
router.get(
  "/loans/pending",
  authenticateUser,
  authorizeRoles("OFFICER"),
  getPendingLoans
);
router.post(
  "/loans/:id/review",
  authenticateUser,
  authorizeRoles("OFFICER"),
  reviewLoan
);

export default router;
