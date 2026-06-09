const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getRevenueSummary,
  getRevenueHistory,
  getRevenueAnalytics,
} = require("../controllers/revenueController");

const router = express.Router();

router.get("/summary", protect, getRevenueSummary);
router.get("/history", protect, getRevenueHistory);
router.get("/analytics", protect, getRevenueAnalytics);

module.exports = { revenueRoutes: router };
