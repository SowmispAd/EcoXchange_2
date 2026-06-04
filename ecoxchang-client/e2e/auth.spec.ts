import { test, expect } from '@playwright/test';
import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';

// Load server .env to connect to MongoDB
dotenv.config({ path: 'e:/My Projects/EcoXchange_2/server/.env' });

const MONGODB_URI = process.env.MONGODB_URI;

test.describe('E2E Auth & Onboarding Flow', () => {

  test.beforeAll(async () => {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI not found in env');
    }
    await mongoose.connect(MONGODB_URI);
  });

  test.afterAll(async () => {
    await mongoose.disconnect();
  });

  test.beforeEach(async ({ page }) => {
    // Enable browser console logging
    page.on('console', msg => {
      console.log(`[BROWSER CONSOLE] (${msg.type()}): ${msg.text()}`);
    });

    // Capture uncaught exceptions
    page.on('pageerror', err => {
      console.error(`[BROWSER PAGEERROR]: ${err.message}\n${err.stack}`);
    });

    // Capture failed requests
    page.on('requestfailed', request => {
      console.error(`[BROWSER REQFAILED]: ${request.method()} ${request.url()} - ${request.failure()?.errorText}`);
    });

    // Delete OTP records for our test number before each test
    const OtpSchema = new mongoose.Schema({}, { strict: false });
    const Otp = mongoose.models.Otp || mongoose.model('Otp', OtpSchema, 'otps');
    await Otp.deleteMany({ phoneNumber: '+919999999999' });

    // Clean up test user if it exists
    const UserSchema = new mongoose.Schema({}, { strict: false });
    const User = mongoose.models.User || mongoose.model('User', UserSchema, 'users');
    await User.deleteOne({ phoneNumber: '+919999999999' });
    
    // Also delete any potential wallet for test user
    const WalletSchema = new mongoose.Schema({}, { strict: false });
    const Wallet = mongoose.models.Wallet || mongoose.model('Wallet', WalletSchema, 'wallets');
    await Wallet.deleteOne({ phone: '+919999999999' });
  });

  test('Email/Password Login and Role-based Dashboard Redirection', async ({ page }) => {
    // We will test Admin login
    await page.goto('/login');
    
    // Select email/password mode (it is default)
    await page.fill('#email', 'admin.demo@ecoxchange.app');
    await page.fill('#password', 'Password123!');
    await page.click('button[type="submit"]');

    // Should redirect to admin dashboard
    await expect(page).toHaveURL(/\/admin\/dashboard/);
    await expect(page.locator('h1')).toContainText(/Dashboard|Overview/i);

    // Test logout
    await page.getByRole('button', { name: /log out/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('New User OTP Flow, Signup & Onboarding Flow', async ({ page }) => {
    await page.goto('/login');

    // Switch to Phone/OTP mode
    await page.click('text=Phone/OTP');

    // Enter test phone number
    await page.fill('#phone', '9999999999'); // normalized to +919999999999
    await page.click('button[type="submit"]');

    // Wait for OTP page redirect
    await expect(page).toHaveURL(/\/verify-otp/);

    // Retrieve OTP from DB
    const OtpSchema = new mongoose.Schema({}, { strict: false });
    const Otp = mongoose.models.Otp || mongoose.model('Otp', OtpSchema, 'otps');
    
    // Poll for the OTP record (wait up to 5 seconds)
    let otpRecord = null;
    for (let i = 0; i < 10; i++) {
      otpRecord = await Otp.findOne({ phoneNumber: '+919999999999' }).sort({ createdAt: -1 });
      if (otpRecord) break;
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    if (!otpRecord) {
      throw new Error('OTP record not found in MongoDB');
    }

    const otpCode = otpRecord.otp;
    expect(otpCode).toHaveLength(6);

    // Fill OTP
    await page.fill('#otp', otpCode);
    await page.click('button[type="submit"]');

    // Should redirect to register page since it's a new phone
    await expect(page).toHaveURL(/\/register/);
    await expect(page.locator('text=Phone number verified: +919999999999')).toBeVisible();

    // Fill registration form
    await page.fill('#fullName', 'E2E Test User');
    await page.fill('#email', 'e2etest@ecoxchange.app');
    await page.fill('#password', 'password123');
    await page.fill('#address', '123 Eco Street');
    await page.click('button[type="submit"]');

    // Should redirect to trial dashboard after successful registration
    await expect(page).toHaveURL(/\/trial\/dashboard/);
    await expect(page.locator('h1')).toContainText(/Dashboard/i);

    // Verify session persistence by refreshing
    await page.reload();
    await expect(page).toHaveURL(/\/trial\/dashboard/);

    // Logout
    await page.getByRole('button', { name: /log out/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });
});
