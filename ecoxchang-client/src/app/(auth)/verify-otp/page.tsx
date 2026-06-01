"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, ShieldCheck, ArrowRight } from "lucide-react";
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

export default function VerifyOtpPage() {
  const router = useRouter();
  const { pendingPhone, setSession, setIsNewUser } = useAuthStore();
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
    if ((window as any).recaptchaVerifier) {
      try {
        (window as any).recaptchaVerifier.clear();
      } catch (e) {}
    }
    
    (window as any).recaptchaVerifier = new RecaptchaVerifier(
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
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const confirmationResult = (window as any).confirmationResult;
      if (!confirmationResult) {
        toast.error("Verification session expired. Please request a new OTP.");
        router.push("/login");
        return;
      }

      const result = await confirmationResult.confirm(otp);
      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken();

      const res = await api.post("/auth/firebase", { idToken });

      if (res.data?.success) {
        toast.success("OTP Verified!");
        const { token, data } = res.data;
        const { user: backendUser, modelName } = data;
        const mappedUser = mapApiUserToStore(backendUser, modelName);
        setSession({ token, user: mappedUser, backendModel: modelName });
        router.push(defaultHomeForRole(mappedUser.role));
      }
    } catch (err: any) {
      console.error("OTP verification error:", err);
      if (err.response?.status === 404) {
        toast.success("Phone verified. Please complete your registration!");
        setIsNewUser(true);
        router.push("/register");
      } else {
        toast.error(err.response?.data?.message || err.message || "Invalid OTP code");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!pendingPhone) return;
    try {
      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      if (!appVerifier) {
        throw new Error("reCAPTCHA verifier is not initialized");
      }

      const confirmationResult = await signInWithPhoneNumber(auth, pendingPhone, appVerifier);
      (window as any).confirmationResult = confirmationResult;

      toast.success("New OTP sent!");
      setCooldown(60);
    } catch (err: any) {
      console.error("Firebase Resend Error:", err);
      toast.error(err.message || "Failed to resend OTP");
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
