const mongoose = require("mongoose");
const { Reward } = require("../models/Reward");
const { RewardRedemption } = require("../models/RewardRedemption");
const { createNotification } = require("../services/notificationService");
const { User } = require("../models/User");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// --------------------
// Admin CRUD
// --------------------
const createReward = async (req, res, next) => {
  try {
    const {
      title,
      description,
      pointsRequired,
      category,
      image,
      stock,
      isActive,
    } = req.body || {};

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "title is required" });
    }
    if (pointsRequired === undefined) {
      return res.status(400).json({
        success: false,
        message: "pointsRequired is required",
      });
    }
    if (!category) {
      return res
        .status(400)
        .json({ success: false, message: "category is required" });
    }
    if (stock === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "stock is required" });
    }

    const reward = await Reward.create({
      title,
      description: description || "",
      pointsRequired,
      category,
      image: image || "",
      stock,
      isActive: isActive !== undefined ? isActive : true,
    });

    return res.status(201).json({
      success: true,
      message: "Reward created successfully",
      data: reward,
    });
  } catch (err) {
    return next(err);
  }
};

const updateReward = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid reward id" });
    }

    const updated = await Reward.findByIdAndUpdate(
      req.params.id,
      req.body || {},
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Reward not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Reward updated successfully",
      data: updated,
    });
  } catch (err) {
    return next(err);
  }
};

const deleteReward = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid reward id" });
    }

    const updated = await Reward.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true },
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Reward not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Reward deleted successfully",
    });
  } catch (err) {
    return next(err);
  }
};

// --------------------
// Phase-5 Reward Endpoints
// --------------------
// GET /api/rewards (public)
const getAllRewards = async (_req, res, next) => {
  try {
    const rewards = await Reward.find({ isActive: true }).sort({
      pointsRequired: 1,
    });

    return res.status(200).json({
      success: true,
      message: "Rewards fetched successfully",
      data: rewards,
    });
  } catch (err) {
    return next(err);
  }
};

// GET /api/rewards/leaderboard (public)
const getLeaderboard = async (_req, res, next) => {
  try {
    const top = await User.find({}, "name ecoPoints role")
      .sort({ ecoPoints: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      message: "Leaderboard fetched successfully",
      data: top,
    });
  } catch (err) {
    return next(err);
  }
};

// GET /api/rewards/my-points
const getMyPoints = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: "EcoPoints fetched successfully",
      data: { ecoPoints: req.user.ecoPoints },
    });
  } catch (err) {
    return next(err);
  }
};

// POST /api/rewards/redeem/:rewardId
const redeemReward = async (req, res, next) => {
  try {
    const { rewardId } = req.params;

    if (!isValidObjectId(rewardId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid reward id" });
    }

    const reward = await Reward.findById(rewardId);
    if (!reward || !reward.isActive) {
      return res
        .status(404)
        .json({ success: false, message: "Reward not available" });
    }

    if (Number(reward.stock) <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Reward out of stock" });
    }

    const user = req.user;
    const userEco = Number(user.ecoPoints || 0);
    const pointsRequired = Number(reward.pointsRequired || 0);

    if (userEco < pointsRequired) {
      return res
        .status(400)
        .json({ success: false, message: "Not enough ecoPoints" });
    }

    const redemption = await RewardRedemption.create({
      user: user._id,
      reward: reward._id,
      pointsSpent: pointsRequired,
      status: "delivered",
      redeemedAt: new Date(),
      fulfillmentDetails: {},
    });

    reward.stock = Math.max(0, Number(reward.stock) - 1);
    await reward.save();

    user.ecoPoints = userEco - pointsRequired;
    await user.save();

    await createNotification({
      recipient: user._id,
      recipientModel: user.constructor.modelName,
      title: "Reward redeemed",
      message: `You redeemed: ${reward.title}`,
      type: "reward_redeemed",
      metadata: {
        rewardId: reward._id,
        pointsSpent: pointsRequired,
        redemptionId: redemption._id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Reward redeemed successfully",
      data: redemption,
    });
  } catch (err) {
    return next(err);
  }
};

// GET /api/rewards/my-redemptions
const getMyRedemptions = async (req, res, next) => {
  try {
    const redemptions = await RewardRedemption.find({ user: req.user._id })
      .populate("reward")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Your redemptions fetched successfully",
      data: redemptions,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  // admin
  createReward,
  updateReward,
  deleteReward,

  // phase-5 public/member
  getAllRewards,
  getLeaderboard,
  getMyPoints,
  redeemReward,
  getMyRedemptions,
};
