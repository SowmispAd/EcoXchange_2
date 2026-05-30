const express = require("express");
const { verifyPayment } = require("../services/paymentService");
const { Order } = require("../models/Order");
const { Product } = require("../models/Product");
const { AuditLog } = require("../models/AuditLog");
const { Cart } = require("../models/Cart");
const { protect } = require("../middleware/guards");

const router = express.Router();

router.post("/webhook", async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const body = req.body;

    // Razorpay webhook validation logic here
    // For this implementation, we will use a simpler verification flow 
    // expected by standard razorpay callback.

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const isValid = await verifyPayment(razorpay_signature, razorpay_order_id, razorpay_payment_id);
      
      if (!isValid) {
        return res.status(400).json({ success: false, message: "Invalid signature" });
      }

      const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      order.paymentStatus = "paid";
      order.razorpayPaymentId = razorpay_payment_id;
      await order.save();

      // Reduce stock now that payment is confirmed
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock = Math.max(0, product.stock - item.quantity);
          if (product.stock === 0) product.status = "out_of_stock";
          await product.save();
        }
      }

      await AuditLog.create({
        action: "payment_webhook_success",
        user: order.user,
        details: { orderId: order._id, razorpay_payment_id }
      });

      return res.status(200).json({ success: true, message: "Payment verified successfully" });
    }

    return res.status(400).json({ success: false, message: "Invalid payload" });
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/verify", protect, async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing required payment fields" });
    }

    const isValid = await verifyPayment(razorpay_signature, razorpay_order_id, razorpay_payment_id);
    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.paymentStatus !== "paid") {
      order.paymentStatus = "paid";
      order.razorpayPaymentId = razorpay_payment_id;
      await order.save();

      // Reduce stock
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock = Math.max(0, product.stock - item.quantity);
          if (product.stock === 0) product.status = "out_of_stock";
          await product.save();
        }
      }

      // Clear user cart
      await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

      await AuditLog.create({
        action: "payment_verify_success",
        user: req.user._id,
        details: { orderId: order._id, razorpay_payment_id }
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified and order processed successfully",
      data: order
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = { paymentRoutes: router };
