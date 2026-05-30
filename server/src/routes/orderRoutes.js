const express = require("express");
const { protect, authorize } = require("../middleware/guards");
const { checkout } = require("../controllers/orderController");

const router = express.Router();

router.post("/checkout", protect, authorize("citizen", "admin"), checkout);

module.exports = { orderRoutes: router };
