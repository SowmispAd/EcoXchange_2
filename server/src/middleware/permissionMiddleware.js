const { User } = require("../models/User");
const { canManageRole } = require("../utils/canManageRole");

const canManageUser = () => {
  return async (req, res, next) => {
    try {
      const targetUserId = req.params.id;

      if (!targetUserId) {
        return res.status(400).json({
          success: false,
          message: "Missing user id",
        });
      }

      const targetUser = await User.findById(targetUserId);

      if (!targetUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (req.user?.role === "admin") {
        req.targetUser = targetUser;
        return next();
      }

      const managerRole = req.user?.role;
      const targetRole = targetUser.role;

      if (!managerRole) {
        return res.status(401).json({
          success: false,
          message: "Not authorized. Missing user role",
        });
      }

      const allowed = canManageRole(managerRole, targetRole);
      if (!allowed) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to manage this user",
        });
      }

      req.targetUser = targetUser;
      return next();
    } catch (err) {
      return next(err);
    }
  };
};

module.exports = { canManageUser };
