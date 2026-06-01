const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getMyWallet, requestWithdrawal, listLedger } = require("../controllers/walletController");

const router = express.Router();

router.get("/me", protect, getMyWallet);
// /ledger and /transactions are the same endpoint — support both names
router.get("/ledger", protect, listLedger);
router.get("/transactions", protect, listLedger);
router.post("/withdraw", protect, requestWithdrawal);

module.exports = { walletRouter: router };
