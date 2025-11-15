import LoanApplication from "../models/LoanApplication.js";
import LoanOfficer from "../models/LoanOfficer.js";
import { evaluateLoan } from "../services/loanService.js";

// 🔹 GET /officer/loans/pending
export const getPendingLoans = async (req, res) => {
  try {
    const pendingLoans = await LoanApplication.find({ status: "PENDING" })
      .populate("customerId", "income creditScore")
      .populate({
        path: "customerId",
        populate: { path: "userId", select: "name email" },
      });

    return res
      .status(200)
      .json({ message: "successfully fetched pending loans", pendingLoans });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// 🔹 POST /officer/loans/:id/review
export const reviewLoan = async (req, res) => {
  try {
    const officerId = req.user.userId; // from JWT
    const { id } = req.params;

    // if (!["APPROVE", "REJECT"].includes(action))
    //   return res.status(400).json({ message: "Invalid action type" });

    const officer = await LoanOfficer.findOne({ userId: officerId });
    if (!officer)
      return res.status(403).json({ message: "Officer record not found" });

    const loan = await LoanApplication.findById(id);
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    if (loan.status !== "PENDING")
      return res.status(400).json({ message: "Loan already reviewed" });

    loan.officerId = officer._id;
    // loan.status = action === "APPROVE" ? "APPROVED" : "REJECTED";
    const evaluationResult = await evaluateLoan(loan._id);
    loan.eligibilityScore = evaluationResult.eligibilityScore;
    loan.status = evaluationResult.status;
    await loan.save();

    return res.status(200).json({
      message: `Loan ${evaluationResult.status.toLowerCase()} successfully.`,
      loanId: loan._id,
      status: loan.status,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
