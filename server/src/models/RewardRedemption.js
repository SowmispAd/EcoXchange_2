const mongoose = require("mongoose");

const rewardRedemptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    reward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reward",
      required: true,
    },

    pointsSpent: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: ["pending", "approved", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },

    redeemedAt: { type: Date },

    fulfillmentDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

const RewardRedemption = mongoose.model(
  "RewardRedemption",
  rewardRedemptionSchema,
);

module.exports = { RewardRedemption };
