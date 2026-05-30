const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const {
  listPlans,
  createMembershipOrder,
  verifyMembershipPayment,
  getMyMembership,
} = require("../controllers/membershipController");

const membershipRouter = express.Router();

/**
 * Public Route
 * Anyone can view available membership plans.
 */
membershipRouter.get("/plans", listPlans);

/**
 * Protected Routes
 * Only trial members and members can purchase and view memberships.
 */
membershipRouter.post(
  "/create-order",
  protect,
  authorizeRoles("trial_member", "member"),
  createMembershipOrder
);

membershipRouter.post(
  "/verify-payment",
  protect,
  authorizeRoles("trial_member", "member"),
  verifyMembershipPayment
);

membershipRouter.get(
  "/my-membership",
  protect,
  authorizeRoles("trial_member", "member"),
  getMyMembership
);

module.exports = { membershipRoutes: membershipRouter };