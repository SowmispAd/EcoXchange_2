const dotenv = require("dotenv");
dotenv.config();

const { connectDB } = require("../config/db");
const { Reward } = require("../models/Reward");

const seedRewards = async () => {
  try {
    await connectDB();

    // Delete existing rewards
    await Reward.deleteMany({});

    // Insert new rewards
    await Reward.insertMany([
      {
        title: "₹50 Coupon",
        description: "Get a ₹50 discount coupon on your next purchase.",
        pointsRequired: 500,
        category: "coupon",
        image: "",
        stock: 100,
        isActive: true,
      },
      {
        title: "Free Pickup",
        description: "Redeem one free premium waste pickup.",
        pointsRequired: 300,
        category: "gift",
        image: "",
        stock: 100,
        isActive: true,
      },
      {
        title: "Tree Plantation Donation",
        description: "Sponsor planting a tree in your name.",
        pointsRequired: 1000,
        category: "donation",
        image: "",
        stock: 100,
        isActive: true,
      },
      {
        title: "₹100 Cashback",
        description: "Receive ₹100 cashback to your wallet.",
        pointsRequired: 1500,
        category: "cashback",
        image: "",
        stock: 50,
        isActive: true,
      },
    ]);

    console.log("✅ Rewards seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding rewards:", error);
    process.exit(1);
  }
};

seedRewards();
