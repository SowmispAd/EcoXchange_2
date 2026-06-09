const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { validationMiddleware } = require("../middleware/validationMiddleware");
const {
  createScheduleValidation,
  updateScheduleValidation,
} = require("../validations/recyclerValidation");
const {
  createSchedule,
  getSchedules,
  getAvailableSchedules,
  getScheduleCapacity,
  updateSchedule,
  deleteSchedule,
  patchScheduleStatus,
} = require("../controllers/scheduleController");

const router = express.Router();

// Publicly available schedules (e.g. for members to book)
router.get("/available", protect, getAvailableSchedules);

// Recycler only routes
router.post(
  "/",
  protect,
  authorizeRoles("recycler"),
  createScheduleValidation,
  validationMiddleware,
  createSchedule
);

router.get(
  "/",
  protect,
  authorizeRoles("recycler"),
  getSchedules
);

router.get(
  "/:id/capacity",
  protect,
  getScheduleCapacity
);

router.put(
  "/:id",
  protect,
  authorizeRoles("recycler"),
  updateScheduleValidation,
  validationMiddleware,
  updateSchedule
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("recycler"),
  deleteSchedule
);

router.patch(
  "/:id/status",
  protect,
  authorizeRoles("recycler"),
  patchScheduleStatus
);

module.exports = { scheduleRouter: router };
