const express = require("express");
const router = express.Router();

router.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "EcoXchange API is running",
  });
});

module.exports = { healthRouter: router };
