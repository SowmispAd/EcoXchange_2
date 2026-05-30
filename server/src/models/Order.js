const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: { type: [orderItemSchema], required: true },

    subtotal: { type: Number, default: 0 },
    taxes: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true, min: 0 },

    paymentStatus: { type: String, enum: ["unpaid", "paid", "refunded"], default: "unpaid" },
    
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },

    deliveryStatus: { type: String, enum: ["created", "processing", "shipped", "delivered"], default: "created" },

    shippingAddress: { type: String, default: "" },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order };
