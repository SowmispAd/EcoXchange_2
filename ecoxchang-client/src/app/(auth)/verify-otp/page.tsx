"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore, defaultHomeForRole } from "@/store/useAuthStore";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { mapApiUserToStore } from "@/lib/map-api-user";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { normalizePhoneNumber } from "@/lib/phone";
import type { ApiError } from "@/types/api";

export default function VerifyOtpPage() {
  const router = useRouter();
  const { pendingPhone, setSession, setIsNewUser, otpMode, setOtpMode } = useAuthStore();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (!pendingPhone) {
      router.push("/login");
    }
  }, [pendingPhone, router]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const setupRecaptcha = () => {
    if (typeof window === "undefined") return;
    if (window.recaptchaVerifier) {
      console.log("Reusing existing RecaptchaVerifier");
      return;
    }
    if (!auth) {
      console.error("Firebase auth is not initialized");
      return;
    }
    
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {
          // reCAPTCHA solved
        },
        "expired-callback": () => {
          toast.error("reCAPTCHA expired. Please try again.");
        }
      }
    );
    console.log("Recaptcha initialized");
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const currentOtpMode = window.otpMode || otpMode;
      const confirmationResult = window.confirmationResult;

      if (currentOtpMode === "backend" || !confirmationResult) {
        // Backend OTP verification mode
        console.log("Verifying OTP via backend for:", pendingPhone);
        const res = await api.post("/auth/verify-otp", {
          phoneNumber: pendingPhone,
          otp,
        });

        if (res.data?.success) {
          if (res.data.isNewUser) {
            toast.success("Phone verified. Please complete your registration!");
            setIsNewUser(true);
            router.push("/register");
          } else {
            toast.success("OTP Verified!");
            const { token, data: user, modelName } = res.data;
            const mappedUser = mapApiUserToStore(user);
            setSession({ token, user: mappedUser, backendModel: modelName });
            router.push(defaultHomeForRole(mappedUser.role));
          }
        }
      } else {
        // Firebase OTP verification mode
        console.log("Verifying OTP via Firebase");
        const result = await confirmationResult.confirm(otp);
        const firebaseUser = result.user;
        const idToken = await firebaseUser.getIdToken();

        const res = await api.post("/auth/firebase", { idToken });

        if (res.data?.success) {
          toast.success("OTP Verified!");
          const { token, data } = res.data;
          const { user: backendUser, modelName } = data;
          const mappedUser = mapApiUserToStore(backendUser);
          setSession({ token, user: mappedUser, backendModel: modelName });
          router.push(defaultHomeForRole(mappedUser.role));
        }
      }
    } catch (err) {
      const apiErr = err as ApiError;
      console.error("OTP verification error:", apiErr);
      if (apiErr.response?.status === 404) {
        toast.success("Phone verified. Please complete your registration!");
        setIsNewUser(true);
        router.push("/register");
      } else {
        toast.error(apiErr.response?.data?.message || apiErr.message || "Invalid OTP code");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!pendingPhone) return;
    try {
      const normalizedPhone = normalizePhoneNumber(pendingPhone);
      const currentOtpMode = window.otpMode || otpMode;

      if (currentOtpMode === "backend") {
        // Resend via backend
        const res = await api.post("/auth/send-otp", { phoneNumber: normalizedPhone });
        if (res.data?.success) {
          toast.success("New OTP sent!");
          setCooldown(60);
        }
      } else {
        // Resend via Firebase
        setupRecaptcha();
        const appVerifier = window.recaptchaVerifier;
        if (!appVerifier) {
          throw new Error("reCAPTCHA verifier is not initialized");
        }

        if (!auth) {
          throw new Error("Firebase auth is not initialized");
        }
        try {
          const confirmationResult = await signInWithPhoneNumber(auth, normalizedPhone, appVerifier);
          window.confirmationResult = confirmationResult;
          toast.success("New OTP sent!");
          setCooldown(60);
        } catch (firebaseErr) {
          const fErr = firebaseErr as ApiError;
          if (
            fErr.code === "auth/billing-not-enabled" ||
            fErr.message?.includes("billing-not-enabled")
          ) {
            // Fall back to backend
            const res = await api.post("/auth/send-otp", { phoneNumber: normalizedPhone });
            if (res.data?.success) {
              window.confirmationResult = null;
              window.otpMode = "backend";
              setOtpMode("backend");
              toast.success("New OTP sent!");
              setCooldown(60);
            }
          } else {
            throw firebaseErr;
          }
        }
      }
    } catch (err) {
      const apiErr = err as ApiError;
      console.error("OTP Resend Error:", apiErr);
      toast.error(apiErr.response?.data?.message || apiErr.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md z-10"
      >
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary/10 p-2 rounded-xl">
              <Leaf className="h-8 w-8 text-primary" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-foreground">EcoXchange</span>
          </Link>
        </div>

        <Card className="border-none shadow-xl bg-background/80 backdrop-blur-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Enter Verification Code</CardTitle>
            <CardDescription className="text-center font-semibold text-primary">
              We sent a 6-digit OTP code to {pendingPhone}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">6-Digit OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="text-center text-2xl tracking-widest font-bold h-14"
                  required
                />
              </div>

              <Button type="submit" disabled={loading || otp.length !== 6} className="w-full mt-2" size="lg">
                {loading ? "Verifying..." : "Verify Code"}
              </Button>
            </form>
            <div id="recaptcha-container" className="hidden" />
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t p-6">
            <div className="text-sm text-center text-muted-foreground">
              {cooldown > 0 ? (
                <span>Resend OTP in <span className="font-bold text-foreground">{cooldown}s</span></span>
              ) : (
                <Button variant="link" onClick={handleResend} className="p-0 h-auto font-bold">
                  Resend OTP Code
                </Button>
              )}
            </div>
            <Link href="/login" className="text-sm text-primary font-semibold hover:underline">
              Back to Login
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
