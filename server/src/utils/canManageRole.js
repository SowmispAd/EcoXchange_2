const { ROLE_PERMISSIONS } = require("./rolePermissions");

const canManageRole = (managerRole, targetRole) => {
  const allowedRoles = ROLE_PERMISSIONS[managerRole] || [];
  return allowedRoles.includes(targetRole);
};

module.exports = { canManageRole };
