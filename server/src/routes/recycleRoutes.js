const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const {
  getAvailablePickups,
  acceptPickupForRecycling,
  processPickup,
  createRecyclerPayment,
  getMyProcessedPickups,
  getRecyclerPayments,
  getRecyclerReport,
} = require("../controllers/recycleController");
const { uploadSingleImage } = require("../middleware/uploadMiddleware");

const recycleRouter = express.Router();

// Recycler
recycleRouter.get(
  "/available",
  protect,
  authorizeRoles("recycler"),
  getAvailablePickups,
);

recycleRouter.put(
  "/accept/:pickupId",
  protect,
  authorizeRoles("recycler"),
  acceptPickupForRecycling,
);

recycleRouter.put(
  "/process/:pickupId",
  protect,
  authorizeRoles("recycler"),
  uploadSingleImage("recyclingCertificate"),
  processPickup,
);

recycleRouter.post(
  "/payments/:pickupId",
  protect,
  authorizeRoles("recycler"),
  createRecyclerPayment,
);

recycleRouter.get(
  "/payments",
  protect,
  authorizeRoles("recycler", "admin", "super_admin"),
  getRecyclerPayments,
);

recycleRouter.get(
  "/report",
  protect,
  authorizeRoles("recycler", "admin", "super_admin"),
  getRecyclerReport,
);

// Optional recycler-only helper
recycleRouter.get(
  "/processed",
  protect,
  authorizeRoles("recycler"),
  getMyProcessedPickups,
);

module.exports = { recycleRoutes: recycleRouter };
