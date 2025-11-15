import { Schema, model } from "mongoose";

const loanApplicationSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    officerId: { type: Schema.Types.ObjectId, ref: "LoanOfficer" },
    amountRequested: { type: Number, required: true },
    tenureMonths: { type: Number, required: true },
    interestRate: { type: Number },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    eligibilityScore: { type: Number },
  },
  { timestamps: true }
);

export default model("LoanApplication", loanApplicationSchema);
