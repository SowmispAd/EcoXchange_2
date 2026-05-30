const { User } = require("../models/User");
const { Supervisor } = require("../models/Supervisor");
const { DeliveryAgent } = require("../models/DeliveryAgent");
const { Recycler } = require("../models/Recycler");
const { Admin } = require("../models/Admin");

const registryByModelName = {
  User,
  Supervisor,
  DeliveryAgent,
  Recycler,
  Admin,
};

const findUserById = async (id, modelName) => {
  const Model = registryByModelName[modelName];
  if (!Model) return null;
  return Model.findById(id).select("-password");
};

module.exports = { findUserById };
