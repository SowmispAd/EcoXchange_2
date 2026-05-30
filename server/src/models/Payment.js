const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    membershipPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MembershipPlan",
      required: true,
    },

    razorpayOrderId: { type: String, required: true, index: true },
    razorpayPaymentId: { type: String },

    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },

    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
      index: true,
    },

    paidAt: { type: Date },
  },
  { timestamps: true },
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = { Payment };
