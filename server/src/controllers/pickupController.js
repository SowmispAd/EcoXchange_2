const mongoose = require("mongoose");
const { Pickup } = require("../models/Pickup");
const { DeliveryAgent } = require("../models/DeliveryAgent");
const { User } = require("../models/User");
const { calculateEcoPoints } = require("../utils/calculateEcoPoints");
const { cloudinary } = require("../config/cloudinary");
const { createNotification } = require("../services/notificationService");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

const uploadToCloudinary = async (file) => {
  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString(
    "base64",
  )}`;

  const uploadResult = await cloudinary.uploader.upload(dataUri, {
    folder: "ecoexchange/pickups",
  });

  return uploadResult?.secure_url;
};

const createPickup = async (req, res) => {
  try {
    const { wasteType, estimatedWeight, address, notes, scheduledDate } =
      req.body || {};

    if (!wasteType) return sendError(res, 400, "wasteType is required");
    if (estimatedWeight === undefined)
      return sendError(res, 400, "estimatedWeight is required");
    if (!address) return sendError(res, 400, "address is required");
    if (!scheduledDate) return sendError(res, 400, "scheduledDate is required");

    // memberImage optional: either from body (if client sends URL) or from multer file upload
    let memberImageUrl = req.body?.memberImage;

    if (req.file) {
      try {
        memberImageUrl = await uploadToCloudinary(req.file);
      } catch (err) {
        return sendError(
          res,
          500,
          "Image upload failed. Please try again later.",
        );
      }
    }

    const pickup = await Pickup.create({
      user: req.user._id,
      userModel: "User",
      wasteType,
      estimatedWeight,
      address,
      notes,
      scheduledDate,
      status: "pending",
      memberImage: memberImageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Pickup request created successfully",
      data: pickup,
    });
  } catch (err) {
    return sendError(res, 500, err.message || "Failed to create pickup");
  }
};

const getMyPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "My pickups fetched successfully",
      data: pickups,
    });
  } catch (err) {
    return sendError(res, 500, err.message || "Failed to fetch my pickups");
  }
};

const getPickupById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) return sendError(res, 400, "Invalid pickup id");

    const pickup = await Pickup.findOne({ _id: id, user: req.user._id });

    if (!pickup) return sendError(res, 404, "Pickup not found");

    return res.status(200).json({
      success: true,
      message: "Pickup fetched successfully",
      data: pickup,
    });
  } catch (err) {
    return sendError(res, 500, err.message || "Failed to fetch pickup");
  }
};

const cancelPickup = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) return sendError(res, 400, "Invalid pickup id");

    const pickup = await Pickup.findOne({ _id: id, user: req.user._id });

    if (!pickup) return sendError(res, 404, "Pickup not found");
    if (pickup.status !== "pending") {
      return sendError(res, 400, "Only pending pickups can be cancelled");
    }

    pickup.status = "cancelled";
    await pickup.save();

    return res.status(200).json({
      success: true,
      message: "Pickup cancelled successfully",
      data: pickup,
    });
  } catch (err) {
    return sendError(res, 500, err.message || "Failed to cancel pickup");
  }
};

const getPendingPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find({ status: "pending" }).sort({
      scheduledDate: 1,
    });

    return res.status(200).json({
      success: true,
      message: "Pending pickups fetched successfully",
      data: pickups,
    });
  } catch (err) {
    return sendError(
      res,
      500,
      err.message || "Failed to fetch pending pickups",
    );
  }
};

const approvePickup = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) return sendError(res, 400, "Invalid pickup id");

    const pickup = await Pickup.findById(id);
    if (!pickup) return sendError(res, 404, "Pickup not found");

    pickup.status = "approved";
    pickup.supervisor = req.user._id;

    await pickup.save();

    return res.status(200).json({
      success: true,
      message: "Pickup approved successfully",
      data: pickup,
    });
  } catch (err) {
    return sendError(res, 500, err.message || "Failed to approve pickup");
  }
};

const rejectPickup = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body || {};

    if (!isValidObjectId(id)) return sendError(res, 400, "Invalid pickup id");
    if (!rejectionReason)
      return sendError(res, 400, "rejectionReason is required");

    const pickup = await Pickup.findById(id);
    if (!pickup) return sendError(res, 404, "Pickup not found");

    pickup.status = "rejected";
    pickup.supervisor = req.user._id;
    pickup.rejectionReason = rejectionReason;

    await pickup.save();

    return res.status(200).json({
      success: true,
      message: "Pickup rejected successfully",
      data: pickup,
    });
  } catch (err) {
    return sendError(res, 500, err.message || "Failed to reject pickup");
  }
};

const assignAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedAgent } = req.body || {};

    if (!isValidObjectId(id)) return sendError(res, 400, "Invalid pickup id");
    if (!assignedAgent) return sendError(res, 400, "assignedAgent is required");
    if (!isValidObjectId(assignedAgent))
      return sendError(res, 400, "Invalid assignedAgent id");

    const agent = await DeliveryAgent.findById(assignedAgent);
    if (!agent) return sendError(res, 404, "DeliveryAgent not found");

    const pickup = await Pickup.findById(id);
    if (!pickup) return sendError(res, 404, "Pickup not found");

    pickup.assignedAgent = agent._id;
    pickup.status = "assigned";

    await pickup.save();

    return res.status(200).json({
      success: true,
      message: "Delivery agent assigned successfully",
      data: pickup,
    });
  } catch (err) {
    return sendError(res, 500, err.message || "Failed to assign agent");
  }
};

const getAssignedPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find({
      assignedAgent: req.user._id,
    }).sort({ scheduledDate: 1 });

    return res.status(200).json({
      success: true,
      message: "Assigned pickups fetched successfully",
      data: pickups,
    });
  } catch (err) {
    return sendError(
      res,
      500,
      err.message || "Failed to fetch assigned pickups",
    );
  }
};

const acceptPickup = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) return sendError(res, 400, "Invalid pickup id");

    const pickup = await Pickup.findOne({
      _id: id,
      assignedAgent: req.user._id,
    });
    if (!pickup) return sendError(res, 404, "Pickup not found");

    pickup.status = "accepted";
    await pickup.save();

    return res.status(200).json({
      success: true,
      message: "Pickup accepted successfully",
      data: pickup,
    });
  } catch (err) {
    return sendError(res, 500, err.message || "Failed to accept pickup");
  }
};

const startPickup = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) return sendError(res, 400, "Invalid pickup id");

    const pickup = await Pickup.findOne({
      _id: id,
      assignedAgent: req.user._id,
    });
    if (!pickup) return sendError(res, 404, "Pickup not found");

    pickup.status = "in_progress";
    await pickup.save();

    return res.status(200).json({
      success: true,
      message: "Pickup started successfully",
      data: pickup,
    });
  } catch (err) {
    return sendError(res, 500, err.message || "Failed to start pickup");
  }
};

const completePickup = async (req, res) => {
  try {
    const { id } = req.params;
    const { actualWeight, completionNotes } = req.body || {};

    if (!isValidObjectId(id)) return sendError(res, 400, "Invalid pickup id");
    if (actualWeight === undefined)
      return sendError(res, 400, "actualWeight is required");

    const pickup = await Pickup.findOne({
      _id: id,
      assignedAgent: req.user._id,
    });
    if (!pickup) return sendError(res, 404, "Pickup not found");

    if (pickup.status === "completed") {
      return sendError(res, 400, "Pickup is already completed");
    }

    // completionImage optional: either from body (URL) or from multer file upload
    let completionImageUrl = req.body?.completionImage;

    if (req.file) {
      try {
        completionImageUrl = await uploadToCloudinary(req.file);
      } catch (err) {
        return sendError(
          res,
          500,
          "Image upload failed. Please try again later.",
        );
      }
    }

    const award = calculateEcoPoints(pickup.wasteType, actualWeight);

    pickup.status = "completed";
    pickup.actualWeight = actualWeight;
    pickup.completionImage = completionImageUrl;
    pickup.completionNotes = completionNotes;
    pickup.ecoPointsAwarded = award;

    await pickup.save();

    // Award points + trial member streak logic
    const user = await User.findById(pickup.user);
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "Pickup completed successfully (eco points not awarded: user not found)",
        data: pickup,
      });
    }

    user.ecoPoints = Number(user.ecoPoints || 0) + Number(award);

    if (user.role === "trial_member") {
      user.streakCount = Number(user.streakCount || 0) + 1;

      if (user.streakCount >= 5) {
        user.role = "member";
        user.membershipStatus = "active";
        user.trialCompleted = true;
      }
    }

    await user.save();

    // Save earned points (Phase 5 requirement)
    pickup.earnedPoints = award;
    await pickup.save();

    // Notification: pickup completed (+ reward earned)
    await createNotification({
      recipient: user._id,
      recipientModel: user.constructor.modelName,
      title: "Pickup completed",
      message: `You earned ${award} EcoPoints from your completed pickup.`,
      type: "pickup_completed",
      metadata: {
        pickupId: pickup._id,
        wasteType: pickup.wasteType,
        actualWeight,
        earnedPoints: award,
      },
    });

    await createNotification({
      recipient: user._id,
      recipientModel: user.constructor.modelName,
      title: "Reward earned",
      message: `You earned ${award} EcoPoints from your completed pickup.`,
      type: "reward_earned",
      metadata: {
        pickupId: pickup._id,
        earnedPoints: award,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Pickup completed successfully",
      data: pickup,
    });
  } catch (err) {
    return sendError(res, 500, err.message || "Failed to complete pickup");
  }
};

const getAllPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "All pickups fetched successfully",
      data: pickups,
    });
  } catch (err) {
    return sendError(res, 500, err.message || "Failed to fetch all pickups");
  }
};

module.exports = {
  createPickup,
  getMyPickups,
  getPickupById,
  cancelPickup,
  getPendingPickups,
  approvePickup,
  rejectPickup,
  assignAgent,
  getAssignedPickups,
  acceptPickup,
  startPickup,
  completePickup,
  getAllPickups,
};
