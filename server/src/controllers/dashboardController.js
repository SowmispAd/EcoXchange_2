const { User } = require("../models/User");
const { Order } = require("../models/Order");
const { Product } = require("../models/Product");
const { TrialSubmission } = require("../models/TrialSubmission");

const getCitizenDashboard = async (req, res, next) => {
  try {
    const orders = await Order.countDocuments({ user: req.user._id });
    const submissions = await TrialSubmission.countDocuments({ user: req.user._id });
    
    return res.status(200).json({
      success: true,
      data: {
        totalOrders: orders,
        totalSubmissions: submissions,
        ecoPoints: req.user.ecoPoints || 0,
        streak: req.user.streak || 0,
        membershipStatus: req.user.membershipStatus
      }
    });
  } catch (err) {
    return next(err);
  }
};

const getRecyclerDashboard = async (req, res, next) => {
  try {
    const products = await Product.countDocuments({ recycler: req.user._id });
    const activeProducts = await Product.countDocuments({ recycler: req.user._id, isActive: true });
    
    return res.status(200).json({
      success: true,
      data: {
        totalProductsListed: products,
        activeProducts,
      }
    });
  } catch (err) {
    return next(err);
  }
};

const getSupervisorDashboard = async (req, res, next) => {
  try {
    const pendingSubmissions = await TrialSubmission.countDocuments({ status: "pending_verification" });
    const approvedSubmissions = await TrialSubmission.countDocuments({ status: "approved", verifiedBy: req.user._id });
    
    return res.status(200).json({
      success: true,
      data: {
        pendingVerifications: pendingSubmissions,
        approvedByMe: approvedSubmissions,
      }
    });
  } catch (err) {
    return next(err);
  }
};

const getAdminDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalOrders = await Order.countDocuments({});
    const totalProducts = await Product.countDocuments({});
    
    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalOrders,
        totalProducts,
      }
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getCitizenDashboard,
  getRecyclerDashboard,
  getSupervisorDashboard,
  getAdminDashboard
};
