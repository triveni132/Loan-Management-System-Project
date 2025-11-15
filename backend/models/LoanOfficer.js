import { Schema, model } from "mongoose";

const loanOfficerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  branch: { type: String },
});

export default model("LoanOfficer", loanOfficerSchema);
