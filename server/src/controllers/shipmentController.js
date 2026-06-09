const { Shipment } = require("../models/Shipment");
const { createNotification } = require("../services/notificationService");
const { AuditLog } = require("../models/AuditLog");

const createShipment = async (req, res, next) => {
  try {
    const { fromHub, wasteType, weightKg } = req.body;
    
    const shipment = await Shipment.create({
      recycler: req.user._id,
      fromHub,
      wasteType,
      weightKg,
      status: "Assigned",
      shipmentHistory: [
        {
          status: "Assigned",
          changedBy: req.user._id,
          remarks: "Shipment assigned to recycler",
        },
      ],
    });

    const io = req.app.get("io");
    if (io) {
      io.to(String(req.user._id)).emit("shipment:updated", shipment);
    }

    return res.status(201).json({
      success: true,
      message: "Shipment created successfully",
      data: shipment,
    });
  } catch (err) {
    return next(err);
  }
};

const getShipments = async (req, res, next) => {
  try {
    const query = req.user.role === "recycler" ? { recycler: req.user._id } : {};
    const shipments = await Shipment.find(query).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: shipments,
    });
  } catch (err) {
    return next(err);
  }
};

const getShipmentById = async (req, res, next) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ success: false, message: "Shipment not found" });
    }

    if (req.user.role === "recycler" && shipment.recycler.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized access to shipment" });
    }

    return res.status(200).json({
      success: true,
      data: shipment,
    });
  } catch (err) {
    return next(err);
  }
};

const updateShipmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const shipment = await Shipment.findById(id);
    if (!shipment) {
      return res.status(404).json({ success: false, message: "Shipment not found" });
    }

    if (req.user.role === "recycler" && shipment.recycler.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    shipment.status = status;
    shipment.shipmentHistory.push({
      status,
      changedBy: req.user._id,
      remarks: remarks || "",
      timestamp: new Date(),
    });

    await shipment.save();

    const io = req.app.get("io");
    if (io) {
      io.to(String(shipment.recycler)).emit("shipment:updated", shipment);
    }

    return res.status(200).json({
      success: true,
      message: "Shipment status updated successfully",
      data: shipment,
    });
  } catch (err) {
    return next(err);
  }
};

const confirmReceipt = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body || {};

    const shipment = await Shipment.findById(id);
    if (!shipment) {
      return res.status(404).json({ success: false, message: "Shipment not found" });
    }

    // Validate ownership
    if (shipment.recycler.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to confirm this shipment" });
    }

    // Verify current status is Delivered
    if (shipment.status !== "Delivered") {
      return res.status(400).json({
        success: false,
        message: `Shipment status is '${shipment.status}'. Expected status is 'Delivered' to confirm receipt.`,
      });
    }

    shipment.status = "Receipt Confirmed";
    shipment.shipmentHistory.push({
      status: "Receipt Confirmed",
      changedBy: req.user._id,
      remarks: remarks || "Receipt confirmed by Recycler",
      timestamp: new Date(),
    });

    await shipment.save();

    // Create Audit Log
    await AuditLog.create({
      action: "shipment_receipt_confirmed",
      user: req.user._id,
      details: { shipmentId: shipment._id, confirmedAt: new Date() },
    });

    // Create Notification
    const notif = await createNotification({
      recipient: req.user._id,
      recipientModel: "Recycler",
      title: "Shipment Receipt Confirmed",
      message: `Receipt has been confirmed for shipment ${shipment._id} (${shipment.weightKg} kg of ${shipment.wasteType}).`,
      type: "receipt_confirmed",
      metadata: { shipmentId: shipment._id },
    });

    const io = req.app.get("io");
    if (io) {
      io.to(String(req.user._id)).emit("notification:new", notif);
      io.to(String(req.user._id)).emit("shipment:updated", shipment);
      // Trigger dynamic updates to revenue
      io.to(String(req.user._id)).emit("revenue:updated");
    }

    return res.status(200).json({
      success: true,
      message: "Receipt confirmed successfully",
      data: shipment,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createShipment,
  getShipments,
  getShipmentById,
  updateShipmentStatus,
  confirmReceipt,
};
