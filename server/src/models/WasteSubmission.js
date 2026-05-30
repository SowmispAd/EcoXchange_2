const mongoose = require("mongoose");

const wasteSubmissionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    proofImageUrls: [{ type: String }],
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: [
        "submitted",
        "awaiting_pickup",
        "picked_up",
        "at_facility",
        "sent_to_recycler",
        "recycled",
        "approved",
        "rejected",
      ],
      default: "submitted",
      index: true,
    },
    statusHistory: [
      {
        status: String,
        at: { type: Date, default: Date.now },
        by: { type: mongoose.Schema.Types.ObjectId },
        note: String,
      },
    ],
    supervisorDecision: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    ecoPointsAwarded: { type: Number, default: 0 },
  },
  { timestamps: true },
);

wasteSubmissionSchema.index({ createdAt: -1 });

const WasteSubmission = mongoose.model("WasteSubmission", wasteSubmissionSchema);
module.exports = { WasteSubmission };
