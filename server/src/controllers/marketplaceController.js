const mongoose = require("mongoose");

const { Product } = require("../models/Product");
const { Order } = require("../models/Order");
const { createNotification } = require("../services/notificationService");
const { Pickup } = require("../models/Pickup");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getAllProducts = async (_req, res, next) => {
  try {
    const products = await Product.find({
      status: { $in: ["active", "draft"] },
      isApprovedByAdmin: true,
    })
      .sort({ createdAt: -1 })
      .limit(200);

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (err) {
    return next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid id" });
    }

    const product = await Product.findOne({
      _id: id,
      isApprovedByAdmin: true,
      status: { $in: ["active", "out_of_stock"] },
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (err) {
    return next(err);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      price,
      quantityAvailable,
      manufactureDate,
      expiryDate,
      materialsUsed,
      totalMaterialWeight,
      lifeSpan,
      sustainabilityScore,
      carbonSavedKg,
    } = req.body || {};

    if (!name)
      return res
        .status(400)
        .json({ success: false, message: "name is required" });
    if (price === undefined)
      return res
        .status(400)
        .json({ success: false, message: "price is required" });
    if (quantityAvailable === undefined)
      return res
        .status(400)
        .json({ success: false, message: "quantityAvailable is required" });
    if (!manufactureDate)
      return res
        .status(400)
        .json({ success: false, message: "manufactureDate is required" });

    // Multer with memory storage provides req.files?.
    const images = [];
    if (req.files?.images) {
      for (const f of req.files.images) {
        if (f.path) images.push(f.path);
      }
    }

    // In this codebase, we upload to cloudinary later; for now accept image URLs from client/body
    // (Clients can also send `images` as JSON stringified array.)
    let parsedImages = [];
    if (req.body?.images) {
      try {
        parsedImages = JSON.parse(req.body.images);
      } catch {
        parsedImages = Array.isArray(req.body.images) ? req.body.images : [];
      }
    }

    const product = await Product.create({
      recycler: req.user._id,
      name,
      description: description || "",
      category: category || "",
      price: Number(price),
      quantityAvailable: Number(quantityAvailable),
      manufactureDate: new Date(manufactureDate),
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      materialsUsed: materialsUsed || [],
      totalMaterialWeight: totalMaterialWeight
        ? Number(totalMaterialWeight)
        : 0,
      lifeSpan: lifeSpan || "",
      sustainabilityScore: sustainabilityScore
        ? Number(sustainabilityScore)
        : 0,
      carbonSavedKg: carbonSavedKg ? Number(carbonSavedKg) : 0,
      images: [...images, ...parsedImages].filter(Boolean),
      status: "draft",
      isApprovedByAdmin: false,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (err) {
    return next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product id" });
    }

    const product = await Product.findById(id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    if (product.recycler.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const updated = await Product.findByIdAndUpdate(id, req.body || {}, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updated,
    });
  } catch (err) {
    return next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product id" });
    }

    const product = await Product.findById(id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    if (product.recycler.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    return next(err);
  }
};

const getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ recycler: req.user._id }).sort({
      createdAt: -1,
    });
    return res.status(200).json({
      success: true,
      message: "Your products fetched successfully",
      data: products,
    });
  } catch (err) {
    return next(err);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, fromCart } = req.body || {};
    const { Cart } = require("../models/Cart");
    const { createRazorpayOrder } = require("../services/paymentService");

    let itemsToProcess = [];

    if (fromCart) {
      const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: "Cart is empty" });
      }
      itemsToProcess = cart.items.map(it => ({
        productId: it.product._id || it.product,
        quantity: Number(it.quantity)
      }));
    } else {
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: "items is required" });
      }
      itemsToProcess = items.map((it) => ({
        productId: it.productId || it.product,
        quantity: Number(it.quantity || 0),
      }));
    }

    // Load products and validate stock/approval
    const products = await Product.find({
      _id: { $in: itemsToProcess.map((x) => x.productId) },
      isApprovedByAdmin: true,
      status: { $in: ["active", "out_of_stock"] },
      isActive: true
    });

    if (products.length !== itemsToProcess.length) {
      return res.status(400).json({
        success: false,
        message: "One or more products are not available or inactive",
      });
    }

    const productMap = new Map(products.map((p) => [p._id.toString(), p]));
    let subtotal = 0;
    const orderItems = [];

    // Stock check and calculation
    for (const it of itemsToProcess) {
      const product = productMap.get(it.productId.toString());
      if (Number(product.stock || 0) < it.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }

      const lineTotal = Number(product.price) * it.quantity;
      subtotal += lineTotal;

      orderItems.push({
        product: product._id,
        quantity: it.quantity,
        unitPrice: product.price,
      });
    }

    const shipping = subtotal > 1000 ? 0 : 50; // free shipping over 1000
    const taxes = Math.round(subtotal * 0.18); // 18% tax demo
    const total = subtotal + shipping + taxes;

    const rzpOrder = await createRazorpayOrder(total, `order_${req.user._id}_${Date.now()}`);

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      subtotal,
      shipping,
      taxes,
      total,
      paymentStatus: "unpaid",
      deliveryStatus: "created",
      shippingAddress: shippingAddress || req.user.address || "",
      razorpayOrderId: rzpOrder ? rzpOrder.id : "demo_order_id",
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        order,
        razorpayOrderId: rzpOrder ? rzpOrder.id : "demo_order_id",
        amount: total * 100,
        currency: "INR"
      },
    });
  } catch (err) {
    return next(err);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    return res.status(200).json({
      success: true,
      message: "Your orders fetched successfully",
      data: orders,
    });
  } catch (err) {
    return next(err);
  }
};

const approveProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product id" });
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      { isApprovedByAdmin: true, status: "active" },
      { new: true, runValidators: true },
    );

    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    return res.status(200).json({
      success: true,
      message: "Product approved",
      data: updated,
    });
  } catch (err) {
    return next(err);
  }
};

const rejectProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product id" });
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      { isApprovedByAdmin: false, status: "archived" },
      { new: true, runValidators: true },
    );

    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    return res.status(200).json({
      success: true,
      message: "Product rejected",
      data: updated,
    });
  } catch (err) {
    return next(err);
  }
};

const getAllOrders = async (_req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(500);
    return res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      data: orders,
    });
  } catch (err) {
    return next(err);
  }
};

const getMySalesReport = async (req, res, next) => {
  try {
    const myProducts = await Product.find({ recycler: req.user._id });
    const myProductIds = myProducts.map((p) => p._id);

    // compute revenue from orders
    const orders = await Order.find({ "items.product": { $in: myProductIds } });

    let revenue = 0;
    for (const order of orders) {
      for (const item of order.items) {
        if (
          myProductIds.some((id) => id.toString() === item.product.toString())
        ) {
          revenue += Number(item.unitPrice) * Number(item.quantity);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Sales report fetched successfully",
      data: {
        totalSales: revenue,
        totalOrders: orders.length,
      },
    });
  } catch (err) {
    return next(err);
  }
};

const getMarketplaceAnalytics = async (_req, res, next) => {
  try {
    const totalProductsListed = await Product.countDocuments({
      isApprovedByAdmin: true,
    });
    const totalOrders = await Order.countDocuments({});
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const total = totalRevenue?.[0]?.total || 0;

    return res.status(200).json({
      success: true,
      message: "Marketplace analytics fetched successfully",
      data: {
        totalProductsListed,
        totalOrders,
        totalRevenue: total,
      },
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  // public/member
  getAllProducts,
  getProductById,
  createOrder,
  getMyOrders,

  // recycler
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getMySalesReport,

  // admin
  approveProduct,
  rejectProduct,
  getAllOrders,
  getMarketplaceAnalytics,
};
