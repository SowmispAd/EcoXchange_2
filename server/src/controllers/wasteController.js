const { WasteSubmission } = require("../models/WasteSubmission");
const { User } = require("../models/User");

const createSubmission = async (req, res, next) => {
  try {
    if (req.user.constructor.modelName !== "User") {
      return res.status(403).json({ success: false, message: "Only household users submit waste" });
    }
    const { proofImageUrls, notes } = req.body || {};
    const ws = await WasteSubmission.create({
      userId: req.user._id,
      proofImageUrls: Array.isArray(proofImageUrls) ? proofImageUrls : [],
      notes: notes || "",
      status: "submitted",
      statusHistory: [{ status: "submitted", note: "Created" }],
    });
    return res.status(201).json({ success: true, message: "Submitted", data: ws });
  } catch (e) {
    return next(e);
  }
};

const listMine = async (req, res, next) => {
  try {
    if (req.user.constructor.modelName !== "User") {
      return res.json({ success: true, data: [] });
    }
    const rows = await WasteSubmission.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
    return res.json({ success: true, data: rows });
  } catch (e) {
    return next(e);
  }
};

const listAllForSupervisor = async (req, res, next) => {
  try {
    const rows = await WasteSubmission.find().sort({ createdAt: -1 }).limit(200);
    return res.json({ success: true, data: rows });
  } catch (e) {
    return next(e);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body || {};
    const allowed = [
      "submitted",
      "awaiting_pickup",
      "picked_up",
      "at_facility",
      "sent_to_recycler",
      "recycled",
      "approved",
      "rejected",
    ];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    const ws = await WasteSubmission.findById(id);
    if (!ws) return res.status(404).json({ success: false, message: "Not found" });
    ws.status = status;
    ws.statusHistory.push({ status, note: note || "", by: req.user._id });
    if (status === "approved" || status === "rejected") {
      ws.supervisorDecision = status === "approved" ? "approved" : "rejected";
    }
    if (status === "approved") {
      const pts = 50;
      ws.ecoPointsAwarded = pts;
      await User.findByIdAndUpdate(ws.userId, { $inc: { ecoPoints: pts, streakCount: 1 } });
    }
    await ws.save();
    return res.json({ success: true, data: ws });
  } catch (e) {
    return next(e);
  }
};

module.exports = { createSubmission, listMine, listAllForSupervisor, updateStatus };
