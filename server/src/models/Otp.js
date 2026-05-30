const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true, index: true },
    otp: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now, expires: 300 }, // 5 minutes TTL
  },
  { timestamps: true }
);

const Otp = mongoose.model("Otp", otpSchema);

module.exports = { Otp };
