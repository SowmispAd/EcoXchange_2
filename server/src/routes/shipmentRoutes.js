const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { validationMiddleware } = require("../middleware/validationMiddleware");
const { confirmReceiptValidation } = require("../validations/recyclerValidation");
const {
  createShipment,
  getShipments,
  getShipmentById,
  updateShipmentStatus,
  confirmReceipt,
} = require("../controllers/shipmentController");

const router = express.Router();

router.get(
  "/",
  protect,
  getShipments
);

router.post(
  "/",
  protect,
  authorizeRoles("recycler", "admin"),
  createShipment
);

router.get(
  "/:id",
  protect,
  getShipmentById
);

router.patch(
  "/:id/status",
  protect,
  authorizeRoles("recycler", "admin"),
  updateShipmentStatus
);

router.post(
  "/:id/confirm-receipt",
  protect,
  authorizeRoles("recycler"),
  confirmReceiptValidation,
  validationMiddleware,
  confirmReceipt
);

module.exports = { shipmentRoutes: router };
