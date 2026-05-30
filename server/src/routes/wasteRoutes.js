const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const {
  createSubmission,
  listMine,
  listAllForSupervisor,
  updateStatus,
} = require("../controllers/wasteController");

const router = express.Router();

router.post("/", protect, createSubmission);
router.get("/mine", protect, listMine);
router.get("/supervisor/all", protect, authorizeRoles("supervisor"), listAllForSupervisor);
router.patch("/:id/status", protect, authorizeRoles("supervisor"), updateStatus);

module.exports = { wasteRouter: router };
