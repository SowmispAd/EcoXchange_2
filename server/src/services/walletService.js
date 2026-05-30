const { Wallet } = require("../models/Wallet");

async function ensureWallet(ownerId, ownerModel) {
  let w = await Wallet.findOne({ ownerId, ownerModel });
  if (!w) {
    w = await Wallet.create({
      ownerId,
      ownerModel,
      ecoPointsBalance: ownerModel === "User" ? 120 : 0,
    });
  }
  return w;
}

module.exports = { ensureWallet };
