const mongoose = require("mongoose");
const { Notification } = require("../models/Notification");
const {
  markAsRead,
  markAllAsRead,
} = require("../services/notificationService");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getMyNotifications = async (req, res, next) => {
  try {
    const recipientId = req.user._id;
    const recipientModel = req.user.constructor.modelName;

    const notifications = await Notification.find({
      recipient: recipientId,
      recipientModel,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      data: notifications,
    });
  } catch (err) {
    return next(err);
  }
};

const readNotification = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification id",
      });
    }

    const recipientId = req.user._id;
    const recipientModel = req.user.constructor.modelName;

    const notification = await Notification.findOne({
      _id: id,
      recipient: recipientId,
      recipientModel,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    const updated = await markAsRead(id);

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: updated,
    });
  } catch (err) {
    return next(err);
  }
};

const readAllNotifications = async (req, res, next) => {
  try {
    const recipientId = req.user._id;

    await markAllAsRead(recipientId);

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getMyNotifications,
  readNotification,
  readAllNotifications,
};
