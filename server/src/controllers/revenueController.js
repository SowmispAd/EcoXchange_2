const { TransactionLedger } = require("../models/TransactionLedger");
const { Shipment } = require("../models/Shipment");
const { RecyclerPayment } = require("../models/RecyclerPayment");

const getRevenueSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Time ranges
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const dayOfWeek = now.getDay();
    const weeklyStart = new Date(todayStart);
    weeklyStart.setDate(weeklyStart.getDate() - dayOfWeek);

    const monthlyStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearlyStart = new Date(now.getFullYear(), 0, 1);

    // Sum transactions helper
    const getSum = async (startDate) => {
      const match = {
        user: userId,
        type: "credit",
      };
      if (startDate) {
        match.timestamp = { $gte: startDate };
      }
      const agg = await TransactionLedger.aggregate([
        { $match: match },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);
      return agg[0]?.total || 0;
    };

    const today = await getSum(todayStart);
    const weekly = await getSum(weeklyStart);
    const monthly = await getSum(monthlyStart);
    const yearly = await getSum(yearlyStart);
    const lifetime = await getSum(null);

    // Dynamic metrics
    const totalCollections = await Shipment.countDocuments({
      recycler: userId,
      status: "Receipt Confirmed",
    });

    const weightAgg = await Shipment.aggregate([
      { $match: { recycler: userId, status: "Receipt Confirmed" } },
      { $group: { _id: null, totalWeight: { $sum: "$weightKg" } } },
    ]);
    const totalWasteProcessed = weightAgg[0]?.totalWeight || 0;

    // Pending/Completed payments from RecyclerPayment
    const recyclerPayments = await RecyclerPayment.find({ recycler: userId });
    let pendingPayouts = 0;
    let completedPayouts = 0;
    recyclerPayments.forEach((p) => {
      if (p.status === "paid") {
        completedPayouts += p.totalAmount;
      } else {
        pendingPayouts += p.totalAmount;
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        earnings: {
          today,
          weekly,
          monthly,
          yearly,
          lifetime,
        },
        metrics: {
          totalCollections,
          totalWasteProcessed,
          pendingPayouts,
          completedPayouts,
        },
      },
    });
  } catch (err) {
    return next(err);
  }
};

const getRevenueHistory = async (req, res, next) => {
  try {
    const history = await TransactionLedger.find({ user: req.user._id })
      .sort({ timestamp: -1 })
      .limit(100);

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (err) {
    return next(err);
  }
};

const getRevenueAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Group ledger credits by source category
    const aggregation = await TransactionLedger.aggregate([
      { $match: { user: userId, type: "credit" } },
      { $group: { _id: "$source", total: { $sum: "$amount" } } },
    ]);

    const formatted = aggregation.map((item) => ({
      name: item._id,
      value: item.total,
    }));

    return res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getRevenueSummary,
  getRevenueHistory,
  getRevenueAnalytics,
};
