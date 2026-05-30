const { User } = require("../models/User");
const { Supervisor } = require("../models/Supervisor");
const { DeliveryAgent } = require("../models/DeliveryAgent");
const { Recycler } = require("../models/Recycler");
const { Admin } = require("../models/Admin");

const modelRegistry = {
  citizen: User,
  trial_member: User,
  member: User,
  supervisor: Supervisor,
  delivery_agent: DeliveryAgent,
  recycler: Recycler,
  admin: Admin,
};

module.exports = { modelRegistry };
