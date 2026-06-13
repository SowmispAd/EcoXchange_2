import { test, expect } from "@playwright/test";
import mongoose from "mongoose";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config({ path: "e:/My Projects/EcoXchange_2/server/.env" });
const MONGODB_URI = process.env.MONGODB_URI;
const QR_SECRET = process.env.QR_SECRET || "eco-secret-key";

interface E2EAgentUser {
  _id: mongoose.Types.ObjectId;
  email: string;
}

interface E2ETestTask {
  _id: mongoose.Types.ObjectId;
}

test.describe("Delivery Agent E2E Production Readiness Tests", () => {
  let agentUser: E2EAgentUser | null = null;
  let testTask: E2ETestTask | null = null;

  test.beforeAll(async () => {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI not found in env");
    }
    await mongoose.connect(MONGODB_URI);

    // Get the seeded delivery agent
    const DeliveryAgentSchema = new mongoose.Schema({}, { strict: false });
    const DeliveryAgent = mongoose.models.DeliveryAgent || mongoose.model("DeliveryAgent", DeliveryAgentSchema, "deliveryagents");
    agentUser = await DeliveryAgent.findOne({ email: "delivery.demo@ecoxchange.app" });

    if (!agentUser) {
      throw new Error("Seed agent user not found");
    }

    // Retrieve normal user for task
    const UserSchema = new mongoose.Schema({}, { strict: false });
    const User = mongoose.models.User || mongoose.model("User", UserSchema, "users");
    const normalUser = await User.findOne({ email: "member.demo@ecoxchange.app" });

    // Seed a specific test task (Pickup) assigned to this agent
    const PickupSchema = new mongoose.Schema({}, { strict: false });
    const Pickup = mongoose.models.Pickup || mongoose.model("Pickup", PickupSchema, "pickups");

    // Clean up any stale test tasks
    await Pickup.deleteMany({ notes: "Playwright E2E Test Task" });

    testTask = await Pickup.create({
      user: normalUser._id,
      userModel: "User",
      assignedAgent: agentUser._id,
      wasteType: "plastic",
      estimatedWeight: 10,
      address: "123 Test Lane, City",
      notes: "Playwright E2E Test Task",
      scheduledDate: new Date(),
      status: "assigned",
      destinationLat: 12.9716,
      destinationLng: 77.5946,
      statusHistory: [
        {
          status: "assigned",
          changedBy: agentUser._id,
          timestamp: new Date(),
          notes: "Task assigned to agent"
        }
      ]
    });
  });

  test.afterAll(async () => {
    const PickupSchema = new mongoose.Schema({}, { strict: false });
    const Pickup = mongoose.models.Pickup || mongoose.model("Pickup", PickupSchema, "pickups");
    await Pickup.deleteMany({ notes: "Playwright E2E Test Task" });

    const ProofSchema = new mongoose.Schema({}, { strict: false });
    const Proof = mongoose.models.Proof || mongoose.model("Proof", ProofSchema, "proofs");
    await Proof.deleteMany({ deliveryAgent: agentUser._id });

    await mongoose.disconnect();
  });

  test.beforeEach(async ({ page }) => {
    // Authenticate delivery agent
    await page.goto("/login");
    await page.fill("#email", "delivery.demo@ecoxchange.app");
    await page.fill("#password", "Password123!");
    await page.click('button[type="submit"]');

    // Should redirect to delivery dashboard
    await expect(page).toHaveURL(/\/delivery\/dashboard/);
  });

  test("Dashboard widgets and Map controls load correctly", async ({ page }) => {
    // Assert cards exist
    await expect(page.locator("text=Total Pickups Today")).toBeVisible();
    await expect(page.locator("text=Distance Covered")).toBeVisible();

    // Map controls - Minimizing map
    await page.locator('button[title="Minimize"]').click();
    await expect(page.locator("text=Live Routing Map")).not.toBeVisible();

    // Maximize back
    await page.locator('button[title="Maximize"]').click();
    await expect(page.locator("text=Live Routing Map")).toBeVisible();

    // Close map
    await page.locator('button[title="Close map"]').click();
    await expect(page.locator("text=Delivery Navigation Map")).not.toBeVisible();

    // Reopen map
    await page.locator("text=Reopen Navigation Map").click();
    await expect(page.locator("text=Delivery Navigation Map")).toBeVisible();
  });

  test("Full task lifecycle, secure QR verification, geofencing and complete validation rules", async ({ page }) => {
    // 1. Accept Task
    const acceptBtn = page.locator(`tr:has-text("123 Test Lane, City") button:has-text("Accept")`);
    await expect(acceptBtn).toBeVisible();
    await acceptBtn.click();
    
    // Status should transition to 'accepted' and 'Start' button should appear
    const startBtn = page.locator(`tr:has-text("123 Test Lane, City") button:has-text("Start")`);
    await expect(startBtn).toBeVisible();

    // 2. Start Task
    await startBtn.click();

    // Buttons for completing, scanning QR, and uploading proof should appear
    const scanBtn = page.locator(`tr:has-text("123 Test Lane, City") button:has-text("Scan QR")`);
    const uploadBtn = page.locator(`tr:has-text("123 Test Lane, City") button:has-text("Upload Proof")`);
    const completeBtn = page.locator(`tr:has-text("123 Test Lane, City") button:has-text("Complete")`);

    await expect(scanBtn).toBeVisible();
    await expect(uploadBtn).toBeVisible();
    await expect(completeBtn).toBeVisible();

    // Try completing task directly before proof/QR/GPS - should block with error message
    await completeBtn.click();
    await expect(page.locator("text=Completion requires at least one uploaded proof of delivery")).toBeVisible();

    // Simulate proof upload directly to database for this task
    const ProofSchema = new mongoose.Schema({}, { strict: false });
    const Proof = mongoose.models.Proof || mongoose.model("Proof", ProofSchema, "proofs");
    await Proof.create({
      taskId: testTask._id,
      deliveryAgent: agentUser._id,
      imageUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      publicId: "sample_id",
      deviceType: "Playwright E2E Tester",
      captureTime: new Date(),
      latitude: 12.9716,
      longitude: 77.5946,
      status: "verified"
    });

    // Try completing again - should still block due to missing QR scan
    await completeBtn.click();
    await expect(page.locator("text=Completion requires verifying customer QR code")).toBeVisible();

    // Simulate location updates (GPS)
    const LocationHistorySchema = new mongoose.Schema({}, { strict: false });
    const LocationHistory = mongoose.models.LocationHistory || mongoose.model("LocationHistory", LocationHistorySchema, "locationhistories");
    await LocationHistory.create({
      agentId: agentUser._id,
      taskId: testTask._id,
      latitude: 12.9716,
      longitude: 77.5946,
      timestamp: new Date()
    });

    // Check invalid QR code error states via Direct API scan verification call
    // A. Expired QR Code
    const expiredExpiry = Date.now() - 10000;
    const expiredSignature = crypto
      .createHmac("sha256", QR_SECRET)
      .update(`${testTask._id}:${agentUser._id}:${expiredExpiry}`)
      .digest("hex");

    const appRequest = page.request;
    const expiredScanRes = await appRequest.post("/api/delivery/scan", {
      data: {
        taskId: testTask._id,
        agentId: agentUser._id,
        expiry: expiredExpiry,
        signature: expiredSignature
      }
    });
    expect(expiredScanRes.status()).toBe(400);

    // B. Tampered Signature
    const tamperedScanRes = await appRequest.post("/api/delivery/scan", {
      data: {
        taskId: testTask._id,
        agentId: agentUser._id,
        expiry: Date.now() + 60000,
        signature: "invalid-signature"
      }
    });
    expect(tamperedScanRes.status()).toBe(400);

    // C. Valid QR code update
    const validExpiry = Date.now() + 120000;
    const validSignature = crypto
      .createHmac("sha256", QR_SECRET)
      .update(`${testTask._id}:${agentUser._id}:${validExpiry}`)
      .digest("hex");

    const validScanRes = await appRequest.post("/api/delivery/scan", {
      data: {
        taskId: testTask._id,
        agentId: agentUser._id,
        expiry: validExpiry,
        signature: validSignature
      }
    });
    expect(validScanRes.status()).toBe(200);

    // Now reload page and complete the task successfully
    await page.reload();
    const activeCompleteBtn = page.locator(`tr:has-text("123 Test Lane, City") button:has-text("Complete")`);
    await activeCompleteBtn.click();

    // Verify task is successfully completed
    await expect(page.locator(`tr:has-text("123 Test Lane, City") span:has-text("completed")`)).toBeVisible();
  });
});
