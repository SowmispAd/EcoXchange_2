# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: delivery.spec.ts >> Delivery Agent E2E Production Readiness Tests >> Full task lifecycle, secure QR verification, geofencing and complete validation rules
- Location: e2e\delivery.spec.ts:118:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('tr:has-text("123 Test Lane, City") button:has-text("Accept")')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('tr:has-text("123 Test Lane, City") button:has-text("Accept")')

```

```yaml
- link "EcoXchange":
  - /url: /
- link "Dashboard":
  - /url: /delivery/dashboard
  - button "Dashboard"
- link "Tasks":
  - /url: /delivery/tasks
  - button "Tasks"
- link "Map":
  - /url: /delivery/map
  - button "Map"
- link "Scanner":
  - /url: /delivery/scanner
  - button "Scanner"
- link "Proofs":
  - /url: /delivery/proofs
  - button "Proofs"
- link "History":
  - /url: /delivery/history
  - button "History"
- text: D
- paragraph: Delivery Demo
- paragraph: delivery
- button "Log out"
- banner:
  - heading "Dashboard" [level=1]
  - searchbox "Search..."
  - button "Toggle dark mode"
  - button
- main:
  - text: Total Pickups Today 0
  - paragraph: Assigned pickups
  - text: Completed Tasks 0 Distance Covered 0 km
  - paragraph: Based on GPS history
  - text: Proof Success Rate 100%
  - paragraph: Verified proof uploads
  - text: Delivery Navigation Map Live route calculations and destinations
  - button "Refresh route"
  - button "Minimize"
  - button "Toggle Fullscreen"
  - button "Close map"
  - text: Live Routing Map Live routing preview (OpenStreetMap).
  - img
  - button
  - button
  - button
  - button "Zoom in"
  - button "Zoom out"
  - link "Leaflet":
    - /url: https://leafletjs.com
  - text: © OpenStreetMap Assigned Tasks Live pickup schedules & verification states No tasks currently assigned. Daily Timeline Real-time operational feed No events recorded.
- status: Route not found
- status: Route not found
- status: Route not found
- alert
```

# Test source

```ts
  21  |   let testTask: E2ETestTask | null = null;
  22  | 
  23  |   test.beforeAll(async () => {
  24  |     if (!MONGODB_URI) {
  25  |       throw new Error("MONGODB_URI not found in env");
  26  |     }
  27  |     await mongoose.connect(MONGODB_URI);
  28  | 
  29  |     // Get the seeded delivery agent
  30  |     const DeliveryAgentSchema = new mongoose.Schema({}, { strict: false });
  31  |     const DeliveryAgent = mongoose.models.DeliveryAgent || mongoose.model("DeliveryAgent", DeliveryAgentSchema, "deliveryagents");
  32  |     agentUser = await DeliveryAgent.findOne({ email: "delivery.demo@ecoxchange.app" });
  33  | 
  34  |     if (!agentUser) {
  35  |       throw new Error("Seed agent user not found");
  36  |     }
  37  | 
  38  |     // Retrieve normal user for task
  39  |     const UserSchema = new mongoose.Schema({}, { strict: false });
  40  |     const User = mongoose.models.User || mongoose.model("User", UserSchema, "users");
  41  |     const normalUser = await User.findOne({ email: "member.demo@ecoxchange.app" });
  42  | 
  43  |     // Seed a specific test task (Pickup) assigned to this agent
  44  |     const PickupSchema = new mongoose.Schema({}, { strict: false });
  45  |     const Pickup = mongoose.models.Pickup || mongoose.model("Pickup", PickupSchema, "pickups");
  46  | 
  47  |     // Clean up any stale test tasks
  48  |     await Pickup.deleteMany({ notes: "Playwright E2E Test Task" });
  49  | 
  50  |     testTask = await Pickup.create({
  51  |       user: normalUser._id,
  52  |       userModel: "User",
  53  |       assignedAgent: agentUser._id,
  54  |       wasteType: "plastic",
  55  |       estimatedWeight: 10,
  56  |       address: "123 Test Lane, City",
  57  |       notes: "Playwright E2E Test Task",
  58  |       scheduledDate: new Date(),
  59  |       status: "assigned",
  60  |       destinationLat: 12.9716,
  61  |       destinationLng: 77.5946,
  62  |       statusHistory: [
  63  |         {
  64  |           status: "assigned",
  65  |           changedBy: agentUser._id,
  66  |           timestamp: new Date(),
  67  |           notes: "Task assigned to agent"
  68  |         }
  69  |       ]
  70  |     });
  71  |   });
  72  | 
  73  |   test.afterAll(async () => {
  74  |     const PickupSchema = new mongoose.Schema({}, { strict: false });
  75  |     const Pickup = mongoose.models.Pickup || mongoose.model("Pickup", PickupSchema, "pickups");
  76  |     await Pickup.deleteMany({ notes: "Playwright E2E Test Task" });
  77  | 
  78  |     const ProofSchema = new mongoose.Schema({}, { strict: false });
  79  |     const Proof = mongoose.models.Proof || mongoose.model("Proof", ProofSchema, "proofs");
  80  |     await Proof.deleteMany({ deliveryAgent: agentUser._id });
  81  | 
  82  |     await mongoose.disconnect();
  83  |   });
  84  | 
  85  |   test.beforeEach(async ({ page }) => {
  86  |     // Authenticate delivery agent
  87  |     await page.goto("/login");
  88  |     await page.fill("#email", "delivery.demo@ecoxchange.app");
  89  |     await page.fill("#password", "Password123!");
  90  |     await page.click('button[type="submit"]');
  91  | 
  92  |     // Should redirect to delivery dashboard
  93  |     await expect(page).toHaveURL(/\/delivery\/dashboard/);
  94  |   });
  95  | 
  96  |   test("Dashboard widgets and Map controls load correctly", async ({ page }) => {
  97  |     // Assert cards exist
  98  |     await expect(page.locator("text=Total Pickups Today")).toBeVisible();
  99  |     await expect(page.locator("text=Distance Covered")).toBeVisible();
  100 | 
  101 |     // Map controls - Minimizing map
  102 |     await page.locator('button[title="Minimize"]').click();
  103 |     await expect(page.locator("text=Live Routing Map")).not.toBeVisible();
  104 | 
  105 |     // Maximize back
  106 |     await page.locator('button[title="Maximize"]').click();
  107 |     await expect(page.locator("text=Live Routing Map")).toBeVisible();
  108 | 
  109 |     // Close map
  110 |     await page.locator('button[title="Close map"]').click();
  111 |     await expect(page.locator("text=Delivery Navigation Map")).not.toBeVisible();
  112 | 
  113 |     // Reopen map
  114 |     await page.locator("text=Reopen Navigation Map").click();
  115 |     await expect(page.locator("text=Delivery Navigation Map")).toBeVisible();
  116 |   });
  117 | 
  118 |   test("Full task lifecycle, secure QR verification, geofencing and complete validation rules", async ({ page }) => {
  119 |     // 1. Accept Task
  120 |     const acceptBtn = page.locator(`tr:has-text("123 Test Lane, City") button:has-text("Accept")`);
> 121 |     await expect(acceptBtn).toBeVisible();
      |                             ^ Error: expect(locator).toBeVisible() failed
  122 |     await acceptBtn.click();
  123 |     
  124 |     // Status should transition to 'accepted' and 'Start' button should appear
  125 |     const startBtn = page.locator(`tr:has-text("123 Test Lane, City") button:has-text("Start")`);
  126 |     await expect(startBtn).toBeVisible();
  127 | 
  128 |     // 2. Start Task
  129 |     await startBtn.click();
  130 | 
  131 |     // Buttons for completing, scanning QR, and uploading proof should appear
  132 |     const scanBtn = page.locator(`tr:has-text("123 Test Lane, City") button:has-text("Scan QR")`);
  133 |     const uploadBtn = page.locator(`tr:has-text("123 Test Lane, City") button:has-text("Upload Proof")`);
  134 |     const completeBtn = page.locator(`tr:has-text("123 Test Lane, City") button:has-text("Complete")`);
  135 | 
  136 |     await expect(scanBtn).toBeVisible();
  137 |     await expect(uploadBtn).toBeVisible();
  138 |     await expect(completeBtn).toBeVisible();
  139 | 
  140 |     // Try completing task directly before proof/QR/GPS - should block with error message
  141 |     await completeBtn.click();
  142 |     await expect(page.locator("text=Completion requires at least one uploaded proof of delivery")).toBeVisible();
  143 | 
  144 |     // Simulate proof upload directly to database for this task
  145 |     const ProofSchema = new mongoose.Schema({}, { strict: false });
  146 |     const Proof = mongoose.models.Proof || mongoose.model("Proof", ProofSchema, "proofs");
  147 |     await Proof.create({
  148 |       taskId: testTask._id,
  149 |       deliveryAgent: agentUser._id,
  150 |       imageUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
  151 |       publicId: "sample_id",
  152 |       deviceType: "Playwright E2E Tester",
  153 |       captureTime: new Date(),
  154 |       latitude: 12.9716,
  155 |       longitude: 77.5946,
  156 |       status: "verified"
  157 |     });
  158 | 
  159 |     // Try completing again - should still block due to missing QR scan
  160 |     await completeBtn.click();
  161 |     await expect(page.locator("text=Completion requires verifying customer QR code")).toBeVisible();
  162 | 
  163 |     // Simulate location updates (GPS)
  164 |     const LocationHistorySchema = new mongoose.Schema({}, { strict: false });
  165 |     const LocationHistory = mongoose.models.LocationHistory || mongoose.model("LocationHistory", LocationHistorySchema, "locationhistories");
  166 |     await LocationHistory.create({
  167 |       agentId: agentUser._id,
  168 |       taskId: testTask._id,
  169 |       latitude: 12.9716,
  170 |       longitude: 77.5946,
  171 |       timestamp: new Date()
  172 |     });
  173 | 
  174 |     // Check invalid QR code error states via Direct API scan verification call
  175 |     // A. Expired QR Code
  176 |     const expiredExpiry = Date.now() - 10000;
  177 |     const expiredSignature = crypto
  178 |       .createHmac("sha256", QR_SECRET)
  179 |       .update(`${testTask._id}:${agentUser._id}:${expiredExpiry}`)
  180 |       .digest("hex");
  181 | 
  182 |     const appRequest = page.request;
  183 |     const expiredScanRes = await appRequest.post("/api/delivery/scan", {
  184 |       data: {
  185 |         taskId: testTask._id,
  186 |         agentId: agentUser._id,
  187 |         expiry: expiredExpiry,
  188 |         signature: expiredSignature
  189 |       }
  190 |     });
  191 |     expect(expiredScanRes.status()).toBe(400);
  192 | 
  193 |     // B. Tampered Signature
  194 |     const tamperedScanRes = await appRequest.post("/api/delivery/scan", {
  195 |       data: {
  196 |         taskId: testTask._id,
  197 |         agentId: agentUser._id,
  198 |         expiry: Date.now() + 60000,
  199 |         signature: "invalid-signature"
  200 |       }
  201 |     });
  202 |     expect(tamperedScanRes.status()).toBe(400);
  203 | 
  204 |     // C. Valid QR code update
  205 |     const validExpiry = Date.now() + 120000;
  206 |     const validSignature = crypto
  207 |       .createHmac("sha256", QR_SECRET)
  208 |       .update(`${testTask._id}:${agentUser._id}:${validExpiry}`)
  209 |       .digest("hex");
  210 | 
  211 |     const validScanRes = await appRequest.post("/api/delivery/scan", {
  212 |       data: {
  213 |         taskId: testTask._id,
  214 |         agentId: agentUser._id,
  215 |         expiry: validExpiry,
  216 |         signature: validSignature
  217 |       }
  218 |     });
  219 |     expect(validScanRes.status()).toBe(200);
  220 | 
  221 |     // Now reload page and complete the task successfully
```