const mongoose = require("mongoose");

const materialsUsedSchema = new mongoose.Schema(
  {
    materialType: {
      type: String,
      enum: ["plastic", "paper", "metal", "glass", "organic", "ewaste"],
      required: true,
    },
    quantityKg: { type: Number, required: true, min: 0 },
    sourcePickupIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pickup" }],
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    recycler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recycler",
      required: true,
      index: true,
    },

    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },

    category: { type: String, default: "" },

    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    isActive: { type: Boolean, default: true },

    manufactureDate: { type: Date, required: true },
    expiryDate: { type: Date },

    materialsUsed: { type: [materialsUsedSchema], default: [] },
    totalMaterialWeight: { type: Number, default: 0 },

    lifeSpan: { type: String, default: "" },
    sustainabilityScore: { type: Number, default: 0 },
    carbonSavedKg: { type: Number, default: 0 },

    images: { type: [String], default: [] },

    status: {
      type: String,
      enum: ["draft", "active", "out_of_stock", "archived"],
      default: "draft",
      index: true,
    },

    isApprovedByAdmin: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

productSchema.pre("save", function (next) {
  if (this.stock === 0 && this.status !== "archived") {
    this.status = "out_of_stock";
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = { Product };
