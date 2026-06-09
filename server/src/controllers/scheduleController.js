const { RecyclerSchedule } = require("../models/RecyclerSchedule");
const { createNotification } = require("../services/notificationService");

const createSchedule = async (req, res, next) => {
  try {
    const {
      date,
      startTime,
      endTime,
      zone,
      maxCapacity,
      acceptedWasteCategories,
      specialInstructions,
      recurrence,
    } = req.body;

    const schedule = await RecyclerSchedule.create({
      recycler: req.user._id,
      date,
      startTime,
      endTime,
      zone,
      maxCapacity,
      acceptedWasteCategories,
      specialInstructions,
      recurrence,
      bookedCapacity: 0,
      status: "active",
    });

    // Notify & emit
    const io = req.app.get("io");
    const title = "New Waste Collection Slot";
    const msg = `Recycler ${req.user.companyName || "Partner"} scheduled a new collection in zone ${zone} on ${new Date(date).toLocaleDateString()}.`;
    
    const notif = await createNotification({
      recipient: req.user._id,
      recipientModel: "Recycler",
      title,
      message: msg,
      type: "schedule_created",
      metadata: { scheduleId: schedule._id },
    });

    if (io) {
      io.to(String(req.user._id)).emit("notification:new", notif);
      io.emit("schedule:updated", schedule);
    }

    return res.status(201).json({
      success: true,
      message: "Schedule created successfully",
      data: schedule,
    });
  } catch (err) {
    return next(err);
  }
};

const getSchedules = async (req, res, next) => {
  try {
    const query = { recycler: req.user._id };
    const schedules = await RecyclerSchedule.find(query).sort({ date: 1 });
    return res.status(200).json({
      success: true,
      data: schedules,
    });
  } catch (err) {
    return next(err);
  }
};

const getAvailableSchedules = async (req, res, next) => {
  try {
    const schedules = await RecyclerSchedule.find({
      status: "active",
      $expr: { $lt: ["$bookedCapacity", "$maxCapacity"] },
    }).sort({ date: 1 });

    return res.status(200).json({
      success: true,
      data: schedules,
    });
  } catch (err) {
    return next(err);
  }
};

const getScheduleCapacity = async (req, res, next) => {
  try {
    const schedule = await RecyclerSchedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ success: false, message: "Schedule not found" });
    }

    // Ownership check
    if (schedule.recycler.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized capacity check" });
    }

    return res.status(200).json({
      success: true,
      data: {
        maxCapacity: schedule.maxCapacity,
        bookedCapacity: schedule.bookedCapacity,
        remainingCapacity: Math.max(0, schedule.maxCapacity - schedule.bookedCapacity),
      },
    });
  } catch (err) {
    return next(err);
  }
};

const updateSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const schedule = await RecyclerSchedule.findById(id);
    if (!schedule) {
      return res.status(404).json({ success: false, message: "Schedule not found" });
    }

    if (schedule.recycler.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to modify this schedule" });
    }

    const updates = req.body;
    // Prevent manual direct overbooking bypass
    if (updates.maxCapacity !== undefined && schedule.bookedCapacity > updates.maxCapacity) {
      return res.status(400).json({
        success: false,
        message: "Cannot set maxCapacity lower than current bookedCapacity",
      });
    }

    Object.assign(schedule, updates);
    await schedule.save();

    const io = req.app.get("io");
    if (io) {
      io.emit("schedule:updated", schedule);
    }

    return res.status(200).json({
      success: true,
      message: "Schedule updated successfully",
      data: schedule,
    });
  } catch (err) {
    return next(err);
  }
};

const deleteSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const schedule = await RecyclerSchedule.findById(id);
    if (!schedule) {
      return res.status(404).json({ success: false, message: "Schedule not found" });
    }

    if (schedule.recycler.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this schedule" });
    }

    await RecyclerSchedule.findByIdAndDelete(id);

    const io = req.app.get("io");
    if (io) {
      io.emit("schedule:updated", { _id: id, deleted: true });
    }

    return res.status(200).json({
      success: true,
      message: "Schedule deleted successfully",
    });
  } catch (err) {
    return next(err);
  }
};

const patchScheduleStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const schedule = await RecyclerSchedule.findById(id);
    if (!schedule) {
      return res.status(404).json({ success: false, message: "Schedule not found" });
    }

    if (schedule.recycler.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    schedule.status = schedule.status === "active" ? "paused" : "active";
    await schedule.save();

    const io = req.app.get("io");
    if (io) {
      io.emit("schedule:updated", schedule);
    }

    return res.status(200).json({
      success: true,
      message: `Schedule status updated to ${schedule.status}`,
      data: schedule,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createSchedule,
  getSchedules,
  getAvailableSchedules,
  getScheduleCapacity,
  updateSchedule,
  deleteSchedule,
  patchScheduleStatus,
};
