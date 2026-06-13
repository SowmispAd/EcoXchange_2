const mongoose = require("mongoose");

const locationHistorySchema = new mongoose.Schema(
  {
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryAgent",
      required: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pickup",
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      expires: 7776000, // 90 days in seconds
    },
  },
  { timestamps: true }
);

locationHistorySchema.index({ agentId: 1 });
locationHistorySchema.index({ taskId: 1 });
locationHistorySchema.index({ timestamp: -1 });

const LocationHistory = mongoose.model("LocationHistory", locationHistorySchema);

module.exports = { LocationHistory };
