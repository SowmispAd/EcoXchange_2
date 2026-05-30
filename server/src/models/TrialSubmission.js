const mongoose = require("mongoose");

const trialSubmissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    imageUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending_verification", "approved", "rejected"],
      default: "pending_verification",
    },
    remarks: { type: String, default: "" },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    verifiedAt: { type: Date },
  },
  { timestamps: true }
);

const TrialSubmission = mongoose.model("TrialSubmission", trialSubmissionSchema);

module.exports = { TrialSubmission };
