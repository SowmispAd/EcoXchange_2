const dotenv = require("dotenv");
dotenv.config();

const { connectDB } = require("../config/db");
const { MembershipPlan } = require("../models/MembershipPlan");

const seedMembershipPlans = async () => {
  try {
    await connectDB();

    // Remove existing plans
    await MembershipPlan.deleteMany({});

    // Insert fresh plans
    await MembershipPlan.insertMany([
      {
        name: "silver",
        price: 199,
        durationDays: 30,
        benefits: [
          "Faster pickup scheduling",
          "Priority customer support",
        ],
        isActive: true,
      },
      {
        name: "gold",
        price: 499,
        durationDays: 90,
        benefits: [
          "Priority pickups",
          "Bonus EcoPoints",
          "Dedicated support",
        ],
        isActive: true,
      },
      {
        name: "platinum",
        price: 999,
        durationDays: 365,
        benefits: [
          "Unlimited priority pickups",
          "Maximum EcoPoints rewards",
          "VIP support",
        ],
        isActive: true,
      },
    ]);

    console.log("✅ Membership plans seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding membership plans:", error);
    process.exit(1);
  }
};

seedMembershipPlans();