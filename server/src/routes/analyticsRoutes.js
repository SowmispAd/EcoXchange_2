 const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const {
  adminOverview,
  wasteByType,
  monthlyTrends,
  supervisorOverview,
  memberOverview,
} = require("../controllers/analyticsController");

const analyticsRouter = express.Router();

// ADMIN
analyticsRouter.get(
  "/admin/overview",
  protect,
  authorizeRoles("admin"),
  adminOverview,
);
analyticsRouter.get(
  "/admin/waste-by-type",
  protect,
  authorizeRoles("admin"),
  wasteByType,
);
analyticsRouter.get(
  "/admin/monthly-trends",
  protect,
  authorizeRoles("admin"),
  monthlyTrends,
);

// SUPERVISOR
analyticsRouter.get(
  "/supervisor/overview",
  protect,
  authorizeRoles("supervisor"),
  supervisorOverview,
);

// MEMBER
analyticsRouter.get(
  "/member/overview",
  protect,
  authorizeRoles("trial_member", "member"),
  memberOverview,
);

// Backward/Phase-7 contract aliases (optional)
analyticsRouter.get(
  "/admin",
  protect,
  authorizeRoles("admin", "super_admin"),
  adminOverview,
);
analyticsRouter.get(
  "/supervisor",
  protect,
  authorizeRoles("supervisor", "admin", "super_admin"),
  supervisorOverview,
);
analyticsRouter.get(
  "/agent",
  protect,
  authorizeRoles("delivery_agent"),
  (_req, res) =>
    res.status(200).json({
      success: true,
      message: "Agent analytics endpoint not implemented in this phase",
      data: {},
    }),
);
analyticsRouter.get(
  "/recycler",
  protect,
  authorizeRoles("recycler"),
  (_req, res) =>
    res.status(200).json({
      success: true,
      message: "Recycler analytics endpoint not implemented in this phase",
      data: {},
    }),
);
analyticsRouter.get(
  "/member",
  protect,
  authorizeRoles("member", "trial_member"),
  memberOverview,
);

module.exports = { analyticsRoutes: analyticsRouter };
