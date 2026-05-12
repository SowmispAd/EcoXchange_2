"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore, defaultHomeForRole, type AppRole } from "@/store/useAuthStore";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function VerifyOtpClient() {
  const router = useRouter();
  const search = useSearchParams();
  const roleParam = (search.get("role") as AppRole | null) || "member";
  const { pendingPhone, login, setPendingPhone, setIsNewUser } = useAuthStore();
  const [otp, setOtp] = useState("");

  const verify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit OTP");
      return;
    }
    const phone = pendingPhone || "+919000000000";
    const isNew = otp === "000000";
    setIsNewUser(isNew);
    setPendingPhone(null);
    if (isNew) {
      login({
        id: "new",
        name: "New user",
        phone,
        role: roleParam,
        ecoPoints: 0,
        streak: 0,
      });
      router.push("/auth/complete-profile");
      return;
    }
    login({
      id: "demo-1",
      name: "Eco user",
      phone,
      email: "you@ecoxchange.app",
      role: roleParam,
      ecoPoints: 2450,
      streak: 3,
      membershipStatus:
        roleParam === "trial" ? "trial" : roleParam === "member" ? "member" : "staff",
    });
    toast.success("Welcome back");
    router.push(defaultHomeForRole(roleParam));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md border-none shadow-xl">
        <CardHeader>
          <CardTitle>Enter OTP</CardTitle>
          <CardDescription>
            Sent to {pendingPhone || "your phone"} · Demo: use any 6 digits to continue as returning user, or{" "}
            <span className="font-mono">000000</span> to simulate first-time profile completion.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={verify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">6-digit code</Label>
              <Input
                id="otp"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="h-12 tracking-widest text-lg"
                placeholder="••••••"
              />
            </div>
            <Button type="submit" className="w-full h-12">
              Verify & continue
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t">
          <Link href="/auth/login" className={cn(buttonVariants({ variant: "ghost" }), "no-underline")}>
            Change number
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
