const express = require("express");
const { protect, authorize } = require("../middleware/guards");
const { checkout } = require("../controllers/orderController");
const { Order } = require("../models/Order");

const router = express.Router();

// Create order + Razorpay order from cart or items list
router.post("/checkout", protect, authorize("citizen", "admin"), checkout);

// Get all orders for the current user
router.get("/my", protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.product", "name images price category")
      .limit(50);
    return res.json({ success: true, message: "Your orders", data: orders });
  } catch (err) {
    return next(err);
  }
});

// Get single order
router.get("/:id", protect, async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
      .populate("items.product", "name images price category");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    return res.json({ success: true, message: "Order", data: order });
  } catch (err) {
    return next(err);
  }
});

module.exports = { orderRoutes: router };
