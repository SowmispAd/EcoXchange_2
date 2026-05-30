const express = require("express");
const { protect } = require("../middleware/guards");
const { getCart, addToCart, updateQuantity, removeItem } = require("../controllers/cartController");

const router = express.Router();

router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.patch("/item/:id", protect, updateQuantity);
router.delete("/item/:id", protect, removeItem);

module.exports = { cartRouter: router };
