/**
 * Seed demo accounts for EcoXchange (phones +919000000001 … 006).
 * Run: npm run seed (from server/)
 */
require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { connectDB } = require("../config/db");
const { User } = require("../models/User");
const { Supervisor } = require("../models/Supervisor");
const { DeliveryAgent } = require("../models/DeliveryAgent");
const { Recycler } = require("../models/Recycler");
const { Admin } = require("../models/Admin");
const { Wallet } = require("../models/Wallet");
const { PlatformSettings } = require("../models/PlatformSettings");
const { LedgerEntry } = require("../models/LedgerEntry");
const { Product } = require("../models/Product");

const PASS = "Password123!";

async function upsertUser(email, data) {
  const hash = await bcrypt.hash(PASS, 10);
  await User.findOneAndUpdate(
    { email },
    { ...data, email, password: hash },
    { upsert: true, new: true },
  );
}

async function run() {
  await connectDB();

  await PlatformSettings.deleteMany({
    key: { $in: ["minWithdrawalAmount", "marketplaceCommissionPercent", "settlementDays"] },
  });
  await PlatformSettings.insertMany([
    { key: "minWithdrawalAmount", value: 100 },
    { key: "marketplaceCommissionPercent", value: 10 },
    { key: "settlementDays", value: 3 },
  ]);

  await upsertUser("trial.demo@ecoxchange.app", {
    name: "Trial Demo",
    phone: "+919000000001",
    role: "trial_member",
    ecoPoints: 200,
    streakCount: 1,
    membershipStatus: "trial",
  });

  await upsertUser("member.demo@ecoxchange.app", {
    name: "Member Demo",
    phone: "+919000000002",
    role: "member",
    ecoPoints: 2400,
    streakCount: 5,
    membershipStatus: "active",
    trialCompleted: true,
  });

  const supHash = await bcrypt.hash(PASS, 10);
  await Supervisor.findOneAndUpdate(
    { email: "supervisor.demo@ecoxchange.app" },
    {
      name: "Supervisor Demo",
      email: "supervisor.demo@ecoxchange.app",
      password: supHash,
      phone: "+919000000003",
      role: "supervisor",
    },
    { upsert: true, new: true },
  );

  const agHash = await bcrypt.hash(PASS, 10);
  await DeliveryAgent.findOneAndUpdate(
    { email: "delivery.demo@ecoxchange.app" },
    {
      name: "Delivery Demo",
      email: "delivery.demo@ecoxchange.app",
      password: agHash,
      phone: "+919000000004",
      role: "delivery_agent",
    },
    { upsert: true, new: true },
  );

  const recHash = await bcrypt.hash(PASS, 10);
  await Recycler.findOneAndUpdate(
    { email: "recycler.demo@ecoxchange.app" },
    {
      companyName: "Recycler Demo Pvt Ltd",
      contactPerson: "Recycler Lead",
      email: "recycler.demo@ecoxchange.app",
      password: recHash,
      phone: "+919000000005",
      role: "recycler",
    },
    { upsert: true, new: true },
  );

  const adHash = await bcrypt.hash(PASS, 10);
  await Admin.findOneAndUpdate(
    { email: "admin.demo@ecoxchange.app" },
    {
      name: "Admin Demo",
      email: "admin.demo@ecoxchange.app",
      password: adHash,
      phone: "+919000000006",
      role: "admin",
    },
    { upsert: true, new: true },
  );

  const trial = await User.findOne({ email: "trial.demo@ecoxchange.app" });
  const member = await User.findOne({ email: "member.demo@ecoxchange.app" });
  const recycler = await Recycler.findOne({ email: "recycler.demo@ecoxchange.app" });
  const admin = await Admin.findOne({ email: "admin.demo@ecoxchange.app" });

  await Wallet.deleteMany({});
  await LedgerEntry.deleteMany({});

  if (trial) {
    await Wallet.create({
      ownerId: trial._id,
      ownerModel: "User",
      availableBalance: 0,
      pendingBalance: 0,
      ecoPointsBalance: trial.ecoPoints || 200,
    });
  }
  if (member) {
    await Wallet.create({
      ownerId: member._id,
      ownerModel: "User",
      availableBalance: 2500,
      pendingBalance: 300,
      lifetimeEarnings: 5000,
      ecoPointsBalance: member.ecoPoints || 2400,
      cashbackBalance: 50,
      rewardBalance: 25,
    });
    await LedgerEntry.create({
      transactionId: `seed_${Date.now()}_1`,
      userId: member._id,
      userModel: "User",
      amount: 900,
      type: "marketplace_sale",
      status: "posted",
      description: "Demo marketplace credit (net)",
    });
  }
  if (recycler) {
    await Wallet.create({
      ownerId: recycler._id,
      ownerModel: "Recycler",
      availableBalance: 12000,
      pendingBalance: 0,
      lifetimeEarnings: 200000,
    });
  }
  if (admin) {
    await Wallet.create({
      ownerId: admin._id,
      ownerModel: "Admin",
      availableBalance: 15000,
      pendingBalance: 0,
      lifetimeEarnings: 999999,
    });
    await LedgerEntry.create({
      transactionId: `seed_${Date.now()}_2`,
      userId: admin._id,
      userModel: "Admin",
      amount: 100,
      type: "marketplace_commission",
      status: "posted",
      description: "Demo commission",
    });
  }

  // Seed marketplace products
  await Product.deleteMany({});
  if (recycler) {
    await Product.create([
      {
        recycler: recycler._id,
        name: "Recycled Plastic Eco-Bin",
        description: "A sleek, durable 15L recycling bin made from 100% post-consumer ocean plastics.",
        category: "Home & Living",
        price: 499,
        stock: 120,
        isActive: true,
        status: "active",
        isApprovedByAdmin: true,
        manufactureDate: new Date(),
        materialsUsed: [{ materialType: "plastic", quantityKg: 1.5 }],
        totalMaterialWeight: 1.5,
        sustainabilityScore: 95,
        carbonSavedKg: 2.4,
        images: ["https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=400"]
      },
      {
        recycler: recycler._id,
        name: "Eco-Friendly Bamboo Notebook",
        description: "Notebook made from highly renewable bamboo fiber and unbleached recycled paper.",
        category: "Stationery",
        price: 180,
        stock: 250,
        isActive: true,
        status: "active",
        isApprovedByAdmin: true,
        manufactureDate: new Date(),
        materialsUsed: [{ materialType: "paper", quantityKg: 0.3 }],
        totalMaterialWeight: 0.3,
        sustainabilityScore: 92,
        carbonSavedKg: 0.5,
        images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400"]
      },
      {
        recycler: recycler._id,
        name: "Biodegradable Organic Jute Bag",
        description: "Sturdy, reusable jute shopping bag decorated with non-toxic soy ink designs.",
        category: "Fashion & Lifestyle",
        price: 299,
        stock: 300,
        isActive: true,
        status: "active",
        isApprovedByAdmin: true,
        manufactureDate: new Date(),
        materialsUsed: [{ materialType: "organic", quantityKg: 0.5 }],
        totalMaterialWeight: 0.5,
        sustainabilityScore: 98,
        carbonSavedKg: 1.8,
        images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400"]
      }
    ]);
  }

  // eslint-disable-next-line no-console
  console.log("Seed complete. Demo phones +919000000001–006 password:", PASS);
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
