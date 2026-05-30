const mongoose = require("mongoose");

const recyclerPaymentSchema = new mongoose.Schema(
  {
    pickup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pickup",
      required: true,
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recycler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recycler",
      required: true,
    },

    wasteType: {
      type: String,
      enum: ["plastic", "paper", "metal", "glass", "organic", "ewaste"],
      required: true,
    },

    weight: { type: Number, required: true, min: 0 },
    ratePerKg: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
      index: true,
    },

    paidAt: { type: Date },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

const RecyclerPayment = mongoose.model(
  "RecyclerPayment",
  recyclerPaymentSchema,
);

module.exports = { RecyclerPayment };
