import LoanApplication from "../models/LoanApplication.js";
import { evaluateLoan } from "../services/loanService.js";
import Customer from "../models/Customer.js";

export const applyLoan = async (req, res) => {
  try {
    const userId = req.user.userId; // userId from JWT
    const { amountRequested, tenureMonths } = req.body;
    console.log(userId);

    if (!amountRequested || !tenureMonths) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Find Customer by userId
    const customer = await Customer.findOne({ userId });

    if (!customer) {
      return res.status(404).json({ message: "Customer profile not found" });
    }

    // LoanApplication needs customer._id, not userId
    const newLoan = new LoanApplication({
      customerId: customer._id,
      amountRequested,
      tenureMonths,
    });

    await newLoan.save();

    return res.status(201).json({
      loanId: newLoan._id,
      newLoan,
      message: "Loan application submitted.",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

export const getLoanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId; // userId from JWT

    // 1️⃣ Find customer by userId
    const customer = await Customer.findOne({ userId });

    if (!customer) {
      return res.status(404).json({
        message: "Customer profile not found",
      });
    }

    // 2️⃣ Find the loan
    const loan = await LoanApplication.findById(id);

    if (!loan) {
      return res.status(404).json({
        message: "Loan not found",
      });
    }

    // 3️⃣ Check if the logged-in customer owns this loan
    if (loan.customerId.toString() !== customer._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized: You cannot view another user's loan status",
      });
    }

    // 4️⃣ Success response
    return res.status(200).json({
      status: loan.status,
      eligibilityScore: loan.eligibilityScore,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// optional auto-evaluate API for testing loanService
export const evaluateLoanHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await evaluateLoan(id);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getMyLoans = async (req, res) => {
  try {
    const userId = req.user.userId; // from JWT

    // 1️⃣ Find customer using userId
    const customer = await Customer.findOne({ userId });

    if (!customer) {
      return res.status(404).json({ message: "Customer profile not found" });
    }

    // 2️⃣ Find all loans for this customer
    const loans = await LoanApplication.find({ customerId: customer._id }).sort(
      { createdAt: -1 }
    ); // newest first

    return res.status(200).json({
      count: loans.length,
      loans,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};
