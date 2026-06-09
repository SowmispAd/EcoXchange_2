const { body, param } = require("express-validator");

const createScheduleValidation = [
  body("date").isISO8601().toDate().withMessage("Valid ISO8601 date is required"),
  body("startTime").matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage("startTime must be in HH:MM format"),
  body("endTime").matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage("endTime must be in HH:MM format"),
  body("zone").notEmpty().withMessage("Zone is required").trim(),
  body("maxCapacity").isNumeric().toInt().withMessage("maxCapacity must be a number"),
  body("acceptedWasteCategories").isArray().withMessage("acceptedWasteCategories must be an array"),
  body("specialInstructions").optional().trim(),
  body("recurrence").optional().isIn(["none", "daily", "weekly", "monthly"]).withMessage("Invalid recurrence pattern"),
];

const updateScheduleValidation = [
  param("id").isMongoId().withMessage("Invalid schedule ID"),
  body("date").optional().isISO8601().toDate().withMessage("Valid ISO8601 date is required"),
  body("startTime").optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage("startTime must be in HH:MM format"),
  body("endTime").optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage("endTime must be in HH:MM format"),
  body("zone").optional().notEmpty().withMessage("Zone cannot be empty").trim(),
  body("maxCapacity").optional().isNumeric().toInt().withMessage("maxCapacity must be a number"),
  body("acceptedWasteCategories").optional().isArray().withMessage("acceptedWasteCategories must be an array"),
  body("specialInstructions").optional().trim(),
  body("recurrence").optional().isIn(["none", "daily", "weekly", "monthly"]).withMessage("Invalid recurrence pattern"),
];

const confirmReceiptValidation = [
  param("id").isMongoId().withMessage("Invalid shipment ID"),
  body("remarks").optional().trim(),
];

module.exports = {
  createScheduleValidation,
  updateScheduleValidation,
  confirmReceiptValidation,
};
