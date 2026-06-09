const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema(
  {
    recycler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recycler",
      required: true,
      index: true,
    },
    fromHub: {
      type: String,
      required: true,
    },
    wasteType: {
      type: String,
      required: true,
    },
    weightKg: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Assigned",
        "Accepted",
        "Collected",
        "In Transit",
        "Delivered",
        "Receipt Confirmed",
        "Processing",
        "Completed",
        "Rejected",
        "Cancelled",
      ],
      default: "Assigned",
      index: true,
    },
    shipmentHistory: [
      {
        status: { type: String, required: true },
        changedBy: { type: mongoose.Schema.Types.ObjectId },
        remarks: { type: String, default: "" },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Shipment = mongoose.model("Shipment", shipmentSchema);

module.exports = { Shipment };
