const express = require("express");
const { protect, authorize, membershipGuard } = require("../middleware/guards");

const {
  uploadSingleImage,
  handleUploadError,
} = require("../middleware/uploadMiddleware");

const {
  createTrialSubmission,
  getMySubmissions,
  getPendingSubmissions,
  approveSubmission,
  rejectSubmission,
  getTrialSchedule,
  getTrialProgress,
  uploadTrialPhoto,
} = require("../controllers/trialController");

const router = express.Router();

/**
 * Trial User Routes
 */
router.get(
  "/schedule",
  protect,
  membershipGuard("trial"),
  getTrialSchedule
);

router.get(
  "/progress",
  protect,
  membershipGuard("trial"),
  getTrialProgress
);

router.get(
  "/submissions/my",
  protect,
  membershipGuard("trial"),
  getMySubmissions
);

/**
 * Upload trial proof photo
 */
router.post(
  "/upload",
  protect,
  membershipGuard("trial"),
  uploadSingleImage("image"),
  handleUploadError,
  uploadTrialPhoto
);

/**
 * Create trial submission
 */
router.post(
  "/submissions",
  protect,
  membershipGuard("trial"),
  createTrialSubmission
);

/**
 * Supervisor/Admin Routes
 */
router.get(
  "/pending",
  protect,
  authorize("admin", "supervisor"),
  getPendingSubmissions
);

router.patch(
  "/submissions/:id/approve",
  protect,
  authorize("admin", "supervisor"),
  approveSubmission
);

router.patch(
  "/submissions/:id/reject",
  protect,
  authorize("admin", "supervisor"),
  rejectSubmission
);

module.exports = { trialRouter: router };