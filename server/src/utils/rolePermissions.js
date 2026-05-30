const ROLE_PERMISSIONS = {
  admin: [
    "trial_member",
    "member",
    "delivery_agent",
    "supervisor",
    "recycler",
    "admin",
  ],
  supervisor: ["trial_member", "member", "delivery_agent"],
  recycler: [],
  delivery_agent: [],
  member: [],
  trial_member: [],
};

module.exports = { ROLE_PERMISSIONS };
