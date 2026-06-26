// ──────────────────────────────────────
// Shared API Response Types
// ──────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  token?: string;
  modelName?: string;
  isNewUser?: boolean;
}

// ──────────────────────────────────────
// Auth Types
// ──────────────────────────────────────

export interface ApiUser {
  _id: string;
  name?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  membershipStatus?: string;
  ecoPoints?: number;
  streak?: number;
  isSuspended?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  data: ApiUser;
  modelName: string;
}

export interface OtpResponse {
  success: boolean;
  message?: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  isNewUser?: boolean;
  token?: string;
  data?: ApiUser;
  modelName?: string;
}

export interface FirebaseAuthResponse {
  success: boolean;
  token: string;
  data: {
    user: ApiUser;
    modelName: string;
  };
}

// ──────────────────────────────────────
// Razorpay Types
// ──────────────────────────────────────

export interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayFailure {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: Record<string, string>;
  };
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
}

export interface RazorpayInstance {
  open: () => void;
  on: (event: string, callback: (response: RazorpayFailure) => void) => void;
}

// ──────────────────────────────────────
// Window Extensions (Firebase/Razorpay)
// ──────────────────────────────────────

import type { ConfirmationResult, RecaptchaVerifier as RecaptchaVerifierType } from "firebase/auth";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifierType;
    confirmationResult?: ConfirmationResult | null;
    otpMode?: "firebase" | "backend";
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

// ──────────────────────────────────────
// Trial Dashboard Types
// ──────────────────────────────────────

export interface TrialSubmission {
  _id: string;
  imageUrl: string;
  status: "pending_verification" | "approved" | "rejected";
  remarks?: string;
  createdAt: string;
}

export interface TrialSchedule {
  day: string;
  wasteCategory: string;
  instructions: string;
}

// ──────────────────────────────────────
// Marketplace Types
// ──────────────────────────────────────

export interface MarketplaceProduct {
  _id: string;
  id?: string;
  name: string;
  category: string;
  price: number;
  images?: string[];
  recycler?: {
    fullName?: string;
    name?: string;
  };
  ecoScore?: number;
  sustainabilityScore?: number;
}

// ──────────────────────────────────────
// Pickup / Member Dashboard Types
// ──────────────────────────────────────

export interface Pickup {
  _id: string;
  scheduledDate?: string;
  createdAt?: string;
  updatedAt?: string;
  status: string;
  weight?: number;
  actualWeight?: number;
  wasteType?: string;
  type?: string;
  ecoPointsAwarded?: number;
  earnedPoints?: number;
  points?: number;
}

export interface RewardItem {
  _id?: string;
  id?: string;
  title?: string;
  name?: string;
  image?: string;
  pointsRequired?: number;
  points?: number;
}

export interface WalletData {
  ecoPointsBalance: number;
}

// ──────────────────────────────────────
// Chart Widget Types
// ──────────────────────────────────────

export interface ChartDataItem {
  name?: string;
  [key: string]: string | number | undefined;
}

// ──────────────────────────────────────
// Error Handling
// ──────────────────────────────────────

export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
  code?: string;
}
