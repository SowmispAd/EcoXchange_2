const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const {
  createReward,
  updateReward,
  deleteReward,
  getAllRewards,
  getLeaderboard,
  getMyPoints,
  redeemReward,
  getMyRedemptions,
} = require("../controllers/rewardController");

const rewardRouter = express.Router();

// Public
// Public
rewardRouter.get("/", getAllRewards);
rewardRouter.get("/leaderboard", getLeaderboard);

// Protected member routes
rewardRouter.get(
  "/my-points",
  protect,
  authorizeRoles("trial_member", "member"),
  getMyPoints,
);

rewardRouter.post(
  "/redeem/:rewardId",
  protect,
  authorizeRoles("trial_member", "member"),
  redeemReward,
);

rewardRouter.get(
  "/my-redemptions",
  protect,
  authorizeRoles("trial_member", "member"),
  getMyRedemptions,
);

// Admin/super_admin manage rewards
rewardRouter.post(
  "/",
  protect,
  authorizeRoles("admin", "super_admin"),
  createReward,
);
rewardRouter.put(
  "/:id",
  protect,
  authorizeRoles("admin", "super_admin"),
  updateReward,
);
rewardRouter.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "super_admin"),
  deleteReward,
);

module.exports = { rewardRoutes: rewardRouter };
