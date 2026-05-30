const Razorpay = require("razorpay");
const crypto = require("crypto");
const { Payment } = require("../models/Payment");
const { MembershipPlan } = require("../models/MembershipPlan");

const razorpayConfigured = Boolean(
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET,
);

const razorpay = razorpayConfigured
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

const createOrder = async (planId, userId) => {
  if (!razorpay) {
    const err = new Error("Razorpay is not configured");
    err.statusCode = 500;
    throw err;
  }

  const plan = await MembershipPlan.findById(planId);
  if (!plan || !plan.isActive) {
    const err = new Error("Membership plan not available");
    err.statusCode = 400;
    throw err;
  }

  // Amount in paise
  const amount = Math.round(Number(plan.price) * 100);

  const order = await razorpay.orders.create({
    amount,
    currency: "INR",
    receipt: `rcpt_${userId}_${planId}_${Date.now()}`,
    payment_capture: 1,
  });

  const payment = await Payment.create({
    user: userId,
    membershipPlan: plan._id,
    razorpayOrderId: order.id,
    amount,
    currency: "INR",
    status: "created",
  });

  return {
    payment,
    razorpayOrderId: order.id,
    amount,
    currency: order.currency,
  };
};

const verifyPayment = async (signature, orderId, paymentId) => {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  return expectedSignature === signature;
};

const createRazorpayOrder = async (amountInRupees, receipt) => {
  if (!razorpay) return null; // Demo mode fallback
  const amount = Math.round(Number(amountInRupees) * 100);
  return razorpay.orders.create({
    amount,
    currency: "INR",
    receipt,
    payment_capture: 1,
  });
};

module.exports = {
  createOrder,
  verifyPayment,
  createRazorpayOrder,
  razorpay
};
