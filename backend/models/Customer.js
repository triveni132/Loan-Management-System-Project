import { Schema, model } from "mongoose";

const customerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  income: { type: Number },
  creditScore: { type: Number },
});

export default model("Customer", customerSchema);
