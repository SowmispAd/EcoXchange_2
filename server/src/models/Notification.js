const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    recipientModel: {
      type: String,
      required: true,
    },

    title: { type: String, required: true, trim: true },
    message: { type: String, required: true },

    type: {
      type: String,
      required: true,
      enum: [
        "pickup_created",
        "pickup_approved",
        "pickup_rejected",
        "pickup_assigned",
        "pickup_completed",
        "reward_earned",
        "reward_redeemed",
        "membership_upgraded",
        "payment_success",
        "payment_failed",
        "system_alert",
      ],
    },

    isRead: { type: Boolean, default: false, index: true },

    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = { Notification };
