const mongoose = require("mongoose");

const withdrawalRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    userModel: { type: String, required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ["upi", "bank"], required: true },
    payoutDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: {
      type: String,
      enum: ["pending", "approved", "processing", "completed", "failed", "rejected"],
      default: "pending",
      index: true,
    },
    razorpayPayoutId: { type: String, default: "" },
    adminNote: { type: String, default: "" },
  },
  { timestamps: true },
);

const WithdrawalRequest = mongoose.model("WithdrawalRequest", withdrawalRequestSchema);
module.exports = { WithdrawalRequest };
