const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { canManageUser } = require("../middleware/permissionMiddleware");
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  suspendUser,
  restoreUser,
  deleteUser,
  createSupervisor,
  createDeliveryAgent,
  createRecycler,
  createAdmin,
} = require("../controllers/adminController");

const router = express.Router();

router.get(
  "/users",
  protect,
  authorizeRoles("admin", "supervisor"),
  getAllUsers,
);

router.get(
  "/users/:id",
  protect,
  authorizeRoles("admin", "supervisor"),
  canManageUser(),
  getUserById,
);

router.patch(
  "/users/:id/role",
  protect,
  authorizeRoles("admin", "supervisor"),
  canManageUser(),
  updateUserRole,
);

router.patch(
  "/users/:id/suspend",
  protect,
  authorizeRoles("admin", "supervisor"),
  canManageUser(),
  suspendUser,
);

router.patch(
  "/users/:id/restore",
  protect,
  authorizeRoles("admin", "supervisor"),
  canManageUser(),
  restoreUser,
);

router.delete(
  "/users/:id",
  protect,
  authorizeRoles("admin", "supervisor"),
  canManageUser(),
  deleteUser,
);

// --------------------
// Admin-only create APIs (multi-collection)
// --------------------
router.post(
  "/create-supervisor",
  protect,
  authorizeRoles("admin"),
  createSupervisor,
);

router.post(
  "/create-delivery-agent",
  protect,
  authorizeRoles("admin"),
  createDeliveryAgent,
);

router.post(
  "/create-recycler",
  protect,
  authorizeRoles("admin"),
  createRecycler,
);

router.post("/create-admin", protect, authorizeRoles("admin"), createAdmin);

module.exports = { adminRoutes: router };
