const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    pointsRequired: { type: Number, required: true, min: 0 },

    category: {
      type: String,
      enum: ["coupon", "cashback", "gift", "donation"],
      required: true,
    },

    image: { type: String, default: "" },
    isActive: { type: Boolean, default: true, index: true },
    stock: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

const Reward = mongoose.model("Reward", rewardSchema);

module.exports = { Reward };
