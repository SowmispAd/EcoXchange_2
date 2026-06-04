# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> E2E Auth & Onboarding Flow >> Email/Password Login and Role-based Dashboard Redirection
- Location: e2e\auth.spec.ts:56:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/admin\/dashboard/
Received string:  "http://localhost:3000/login"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    14 × unexpected value "http://localhost:3000/login"

```

```yaml
- link "EcoXchange":
  - /url: /
- text: Welcome Back Choose your preferred sign-in method
- button "Email/Password"
- button "Phone/OTP"
- text: Email
- textbox "Email":
  - /placeholder: m@example.com
  - text: admin.demo@ecoxchange.app
- text: Password
- link "Forgot password?":
  - /url: /forgot-password
- textbox "Password":
  - /placeholder: ••••••••
  - text: Password123!
- button
- button "Signing In..." [disabled]
- text: Don't have an account?
- link "Sign up":
  - /url: /register
- alert
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import mongoose from 'mongoose';
  3   | import path from 'path';
  4   | import dotenv from 'dotenv';
  5   | 
  6   | // Load server .env to connect to MongoDB
  7   | dotenv.config({ path: 'e:/My Projects/EcoXchange_2/server/.env' });
  8   | 
  9   | const MONGODB_URI = process.env.MONGODB_URI;
  10  | 
  11  | test.describe('E2E Auth & Onboarding Flow', () => {
  12  | 
  13  |   test.beforeAll(async () => {
  14  |     if (!MONGODB_URI) {
  15  |       throw new Error('MONGODB_URI not found in env');
  16  |     }
  17  |     await mongoose.connect(MONGODB_URI);
  18  |   });
  19  | 
  20  |   test.afterAll(async () => {
  21  |     await mongoose.disconnect();
  22  |   });
  23  | 
  24  |   test.beforeEach(async ({ page }) => {
  25  |     // Enable browser console logging
  26  |     page.on('console', msg => {
  27  |       console.log(`[BROWSER CONSOLE] (${msg.type()}): ${msg.text()}`);
  28  |     });
  29  | 
  30  |     // Capture uncaught exceptions
  31  |     page.on('pageerror', err => {
  32  |       console.error(`[BROWSER PAGEERROR]: ${err.message}\n${err.stack}`);
  33  |     });
  34  | 
  35  |     // Capture failed requests
  36  |     page.on('requestfailed', request => {
  37  |       console.error(`[BROWSER REQFAILED]: ${request.method()} ${request.url()} - ${request.failure()?.errorText}`);
  38  |     });
  39  | 
  40  |     // Delete OTP records for our test number before each test
  41  |     const OtpSchema = new mongoose.Schema({}, { strict: false });
  42  |     const Otp = mongoose.models.Otp || mongoose.model('Otp', OtpSchema, 'otps');
  43  |     await Otp.deleteMany({ phoneNumber: '+919999999999' });
  44  | 
  45  |     // Clean up test user if it exists
  46  |     const UserSchema = new mongoose.Schema({}, { strict: false });
  47  |     const User = mongoose.models.User || mongoose.model('User', UserSchema, 'users');
  48  |     await User.deleteOne({ phoneNumber: '+919999999999' });
  49  |     
  50  |     // Also delete any potential wallet for test user
  51  |     const WalletSchema = new mongoose.Schema({}, { strict: false });
  52  |     const Wallet = mongoose.models.Wallet || mongoose.model('Wallet', WalletSchema, 'wallets');
  53  |     await Wallet.deleteOne({ phone: '+919999999999' });
  54  |   });
  55  | 
  56  |   test('Email/Password Login and Role-based Dashboard Redirection', async ({ page }) => {
  57  |     // We will test Admin login
  58  |     await page.goto('/login');
  59  |     
  60  |     // Select email/password mode (it is default)
  61  |     await page.fill('#email', 'admin.demo@ecoxchange.app');
  62  |     await page.fill('#password', 'Password123!');
  63  |     await page.click('button[type="submit"]');
  64  | 
  65  |     // Should redirect to admin dashboard
> 66  |     await expect(page).toHaveURL(/\/admin\/dashboard/);
      |                        ^ Error: expect(page).toHaveURL(expected) failed
  67  |     await expect(page.locator('h1')).toContainText(/Dashboard|Overview/i);
  68  | 
  69  |     // Test logout
  70  |     await page.getByRole('button', { name: /log out/i }).click();
  71  |     await expect(page).toHaveURL(/\/login/);
  72  |   });
  73  | 
  74  |   test('New User OTP Flow, Signup & Onboarding Flow', async ({ page }) => {
  75  |     await page.goto('/login');
  76  | 
  77  |     // Switch to Phone/OTP mode
  78  |     await page.click('text=Phone/OTP');
  79  | 
  80  |     // Enter test phone number
  81  |     await page.fill('#phone', '9999999999'); // normalized to +919999999999
  82  |     await page.click('button[type="submit"]');
  83  | 
  84  |     // Wait for OTP page redirect
  85  |     await expect(page).toHaveURL(/\/verify-otp/);
  86  | 
  87  |     // Retrieve OTP from DB
  88  |     const OtpSchema = new mongoose.Schema({}, { strict: false });
  89  |     const Otp = mongoose.models.Otp || mongoose.model('Otp', OtpSchema, 'otps');
  90  |     
  91  |     // Poll for the OTP record (wait up to 5 seconds)
  92  |     let otpRecord = null;
  93  |     for (let i = 0; i < 10; i++) {
  94  |       otpRecord = await Otp.findOne({ phoneNumber: '+919999999999' }).sort({ createdAt: -1 });
  95  |       if (otpRecord) break;
  96  |       await new Promise(resolve => setTimeout(resolve, 500));
  97  |     }
  98  | 
  99  |     if (!otpRecord) {
  100 |       throw new Error('OTP record not found in MongoDB');
  101 |     }
  102 | 
  103 |     const otpCode = otpRecord.otp;
  104 |     expect(otpCode).toHaveLength(6);
  105 | 
  106 |     // Fill OTP
  107 |     await page.fill('#otp', otpCode);
  108 |     await page.click('button[type="submit"]');
  109 | 
  110 |     // Should redirect to register page since it's a new phone
  111 |     await expect(page).toHaveURL(/\/register/);
  112 |     await expect(page.locator('text=Phone number verified: +919999999999')).toBeVisible();
  113 | 
  114 |     // Fill registration form
  115 |     await page.fill('#fullName', 'E2E Test User');
  116 |     await page.fill('#email', 'e2etest@ecoxchange.app');
  117 |     await page.fill('#password', 'password123');
  118 |     await page.fill('#address', '123 Eco Street');
  119 |     await page.click('button[type="submit"]');
  120 | 
  121 |     // Should redirect to trial dashboard after successful registration
  122 |     await expect(page).toHaveURL(/\/trial\/dashboard/);
  123 |     await expect(page.locator('h1')).toContainText(/Dashboard/i);
  124 | 
  125 |     // Verify session persistence by refreshing
  126 |     await page.reload();
  127 |     await expect(page).toHaveURL(/\/trial\/dashboard/);
  128 | 
  129 |     // Logout
  130 |     await page.getByRole('button', { name: /log out/i }).click();
  131 |     await expect(page).toHaveURL(/\/login/);
  132 |   });
  133 | });
  134 | 
```