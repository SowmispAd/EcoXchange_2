const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getMyNotifications,
  readNotification,
  readAllNotifications,
} = require("../controllers/notificationController");

const notificationRouter = express.Router();

notificationRouter.get("/", protect, getMyNotifications);
notificationRouter.patch("/:id/read", protect, readNotification);
notificationRouter.patch("/read-all", protect, readAllNotifications);

module.exports = { notificationRoutes: notificationRouter };
