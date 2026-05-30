const { Notification } = require("../models/Notification");

const createNotification = async ({
  recipient,
  recipientModel,
  title,
  message,
  type,
  metadata,
}) => {
  if (!recipient || !recipientModel) return null;

  const notification = await Notification.create({
    recipient,
    recipientModel,
    title,
    message,
    type,
    metadata: metadata || {},
  });

  return notification;
};

const markAsRead = async (notificationId) => {
  return Notification.findByIdAndUpdate(
    notificationId,
    { isRead: true },
    { new: true },
  );
};

const markAllAsRead = async (userId) => {
  // userId is used as recipient; recipientModel is not required by spec for marking.
  return Notification.updateMany(
    { recipient: userId, isRead: false },
    { $set: { isRead: true } },
  );
};

module.exports = {
  createNotification,
  markAsRead,
  markAllAsRead,
};
