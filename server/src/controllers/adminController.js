const { User } = require("../models/User");
const { Supervisor } = require("../models/Supervisor");
const { DeliveryAgent } = require("../models/DeliveryAgent");
const { Recycler } = require("../models/Recycler");
const { Admin } = require("../models/Admin");
const { canManageRole } = require("../utils/canManageRole");
const { findUserByEmail } = require("../utils/findUserByEmail");

// --------------------
// Existing admin APIs (legacy; still single-collection based)
// --------------------

const getAllUsers = async (req, res, next) => {
  try {
    if (req.user.role === "admin") {
      const users = await User.find().select("-password");
      return res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: users,
      });
    }

    // supervisor (and other roles should never reach this handler)
    const allowedRoles = ["trial_member", "member", "delivery_agent"];
    const users = await User.find({ role: { $in: allowedRoles } }).select(
      "-password",
    );

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (err) {
    return next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = req.targetUser;

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (err) {
    return next(err);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    const targetUser = req.targetUser;
    const managerRole = req.user.role;

    // permission gate (belt & suspenders; middleware already checked)
    if (managerRole !== "admin") {
      const allowed = canManageRole(managerRole, role);
      if (!allowed) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to manage this user",
        });
      }

      // explicit rule: supervisor cannot promote to privileged roles
      if (role === "supervisor" || role === "admin" || role === "recycler") {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to promote to this role",
        });
      }
    }

    targetUser.role = role;
    await targetUser.save();

    const updated = await User.findById(targetUser._id).select("-password");

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: updated,
    });
  } catch (err) {
    return next(err);
  }
};

const suspendUser = async (req, res, next) => {
  try {
    const { suspendedReason } = req.body;

    const targetUser = req.targetUser;

    targetUser.isSuspended = true;
    targetUser.suspendedAt = new Date();
    targetUser.suspendedReason = suspendedReason || "";

    await targetUser.save();

    const updated = await User.findById(targetUser._id).select("-password");

    return res.status(200).json({
      success: true,
      message: "User suspended successfully",
      data: updated,
    });
  } catch (err) {
    return next(err);
  }
};

const restoreUser = async (req, res, next) => {
  try {
    const targetUser = req.targetUser;

    targetUser.isSuspended = false;
    targetUser.suspendedAt = undefined;
    targetUser.suspendedReason = undefined;

    await targetUser.save();

    const updated = await User.findById(targetUser._id).select("-password");

    return res.status(200).json({
      success: true,
      message: "User restored successfully",
      data: updated,
    });
  } catch (err) {
    return next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user._id.toString() === id) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete yourself",
      });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    return next(err);
  }
};

// --------------------
// New admin-only create APIs (multi-collection aware)
// --------------------

const createSupervisor = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const supervisor = await Supervisor.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Supervisor created successfully",
      data: supervisor,
    });
  } catch (err) {
    return next(err);
  }
};

const createDeliveryAgent = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const deliveryAgent = await DeliveryAgent.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Delivery agent created successfully",
      data: deliveryAgent,
    });
  } catch (err) {
    return next(err);
  }
};

const createRecycler = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const recycler = await Recycler.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Recycler created successfully",
      data: recycler,
    });
  } catch (err) {
    return next(err);
  }
};

const createAdmin = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const admin = await Admin.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: admin,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  // legacy
  getAllUsers,
  getUserById,
  updateUserRole,
  suspendUser,
  restoreUser,
  deleteUser,

  // new
  createSupervisor,
  createDeliveryAgent,
  createRecycler,
  createAdmin,
};
