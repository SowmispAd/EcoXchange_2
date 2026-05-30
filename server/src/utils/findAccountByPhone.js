const { User } = require("../models/User");
const { Supervisor } = require("../models/Supervisor");
const { DeliveryAgent } = require("../models/DeliveryAgent");
const { Recycler } = require("../models/Recycler");
const { Admin } = require("../models/Admin");
const { normalizePhone } = require("./phoneUtils");

const modelsInOrder = [
  { Model: User, modelName: "User" },
  { Model: Supervisor, modelName: "Supervisor" },
  { Model: DeliveryAgent, modelName: "DeliveryAgent" },
  { Model: Recycler, modelName: "Recycler" },
  { Model: Admin, modelName: "Admin" },
];

async function findAccountByPhone(rawPhone) {
  const e164 = normalizePhone(rawPhone);
  if (!e164) return null;

  for (const { Model, modelName } of modelsInOrder) {
    let doc =
      (await Model.findOne({ $or: [{ phone: e164 }, { phoneNumber: e164 }] }).select("+password")) ||
      (await Model.findOne({ $or: [{ phone: rawPhone.trim() }, { phoneNumber: rawPhone.trim() }] }).select("+password"));
    
    if (!doc && e164.startsWith("+91") && e164.length === 13) {
      const ten = e164.slice(3);
      doc = await Model.findOne({ $or: [{ phone: ten }, { phoneNumber: ten }] }).select("+password");
    }
    
    if (doc) return { doc, modelName };
  }
  return null;
}

module.exports = { findAccountByPhone, normalizePhone };
