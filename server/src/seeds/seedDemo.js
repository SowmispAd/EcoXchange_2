const mongoose = require("mongoose");
require("dotenv").config();
const { User } = require("../models/User");
const { Product } = require("../models/Product");
const { Reward } = require("../models/Reward");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ecoxchange";

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB for seeding...");

    // Clear existing
    await User.deleteMany({ email: { $in: ["admin@ecoxchange.com", "supervisor@ecoxchange.com", "recycler@ecoxchange.com"] } });
    
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash("password123", salt);

    const admin = await User.create({
      fullName: "System Admin",
      email: "admin@ecoxchange.com",
      password,
      phoneNumber: "+919000000000",
      role: "admin",
      membershipStatus: "member",
      isPhoneVerified: true
    });

    const supervisor = await User.create({
      fullName: "Area Supervisor",
      email: "supervisor@ecoxchange.com",
      password,
      phoneNumber: "+919000000001",
      role: "supervisor",
      membershipStatus: "member",
      isPhoneVerified: true
    });

    const recycler = await User.create({
      fullName: "Eco Recycler Partner",
      email: "recycler@ecoxchange.com",
      password,
      phoneNumber: "+919000000002",
      role: "recycler",
      membershipStatus: "member",
      isPhoneVerified: true
    });

    console.log("Users seeded successfully");

    // Seed Demo Products
    await Product.deleteMany({});
    await Product.create([
      {
        recycler: recycler._id,
        name: "Recycled Notebook",
        description: "100% recycled paper notebook.",
        category: "Stationery",
        price: 150,
        stock: 500,
        isActive: true,
        status: "active",
        isApprovedByAdmin: true,
        manufactureDate: new Date(),
      },
      {
        recycler: recycler._id,
        name: "Bamboo Toothbrush",
        description: "Eco-friendly bamboo toothbrush.",
        category: "Personal Care",
        price: 50,
        stock: 200,
        isActive: true,
        status: "active",
        isApprovedByAdmin: true,
        manufactureDate: new Date(),
      }
    ]);

    console.log("Products seeded successfully");

    // Seed Rewards
    await Reward.deleteMany({});
    await Reward.create([
      {
        title: "50% Off Zero Waste Store",
        description: "Get 50% off your next purchase at Zero Waste Store.",
        pointsRequired: 500,
        category: "shopping",
        isActive: true,
        code: "ZEROWASTE50"
      },
      {
        title: "Free Eco Tote Bag",
        description: "Redeem for a free reusable tote bag.",
        pointsRequired: 300,
        category: "lifestyle",
        isActive: true,
        code: "FREETOTE"
      }
    ]);

    console.log("Rewards seeded successfully");
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
