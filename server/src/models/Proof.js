const mongoose = require("mongoose");

const proofSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pickup",
      required: true,
    },
    deliveryAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryAgent",
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    deviceType: {
      type: String,
      default: "",
    },
    captureTime: {
      type: Date,
      default: Date.now,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

proofSchema.index({ taskId: 1 });
proofSchema.index({ deliveryAgent: 1 });
proofSchema.index({ status: 1 });

const Proof = mongoose.model("Proof", proofSchema);

module.exports = { Proof };
