import LoanApplication from "../models/LoanApplication.js";
import Customer from "../models/Customer.js";

export const evaluateLoan = async (applicationId) => {
  const application = await LoanApplication.findById(applicationId).populate(
    "customerId"
  );
  if (!application) throw new Error("Loan application not found");

  const customer = await Customer.findById(application.customerId);
  if (!customer) throw new Error("Customer data not found");

  const { income = 0, creditScore = 0 } = customer;

  // Normalize income and credit score to 0–1 range
  const incomeNorm = Math.min(income / 100000, 1); // assume 1 lakh as upper baseline
  const creditScoreNorm = Math.min(creditScore / 900, 1); // credit score max = 900

  const score = 0.6 * creditScoreNorm + 0.4 * incomeNorm;
  const threshold = 0.5; // can be adjusted for stricter eligibility

  const status = score >= threshold ? "APPROVED" : "REJECTED";

  return {
    status: status,
    eligibilityScore: score,
  };
};
