const { User } = require("../models/User");
const { Supervisor } = require("../models/Supervisor");
const { DeliveryAgent } = require("../models/DeliveryAgent");
const { Recycler } = require("../models/Recycler");
const { Admin } = require("../models/Admin");

const collectionsInOrder = [User, Supervisor, DeliveryAgent, Recycler, Admin];

const findUserByEmail = async (email) => {
  for (const Model of collectionsInOrder) {
    const doc = await Model.findOne({ email });
    if (doc) return doc;
  }
  return null;
};

module.exports = { findUserByEmail };
