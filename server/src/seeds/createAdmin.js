const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const { connectDB } = require("../config/db");
const { Admin } = require("../models/Admin");

const createAdmin = async () => {
  try {
    await connectDB();

    await Admin.deleteOne({ email: "admin@ecoxchange.com" });

    await Admin.create({
      name: "Super Admin",
      email: "admin@ecoxchange.com",
      password: "Admin@123",   // Plain text; model hashes it
      role: "admin",
      isSuperAdmin: true,
      isVerified: true,
      phone: "9876543210",
      permissions: ["all"],
    });

    console.log("Admin created successfully");
    console.log("Email: admin@ecoxchange.com");
    console.log("Password: Admin@123");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();