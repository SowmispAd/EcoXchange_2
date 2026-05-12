"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Leaf, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useAuthStore, type AppRole } from "@/store/useAuthStore";
import toast from "react-hot-toast";

export default function LoginClient() {
  const router = useRouter();
  const search = useSearchParams();
  const presetRole = (search.get("role") as AppRole | null) || null;
  const { setPendingPhone } = useAuthStore();
  const [phone, setPhone] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.replace(/\D/g, "").length < 10) {
      toast.error("Enter a valid phone number");
      return;
    }
    setPendingPhone(phone);
    toast.success("OTP sent (demo)");
    const q = presetRole ? `?role=${presetRole}` : "";
    router.push(`/auth/verify-otp${q}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md z-10">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Home
        </Link>
        <Card className="border-none shadow-xl">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="bg-primary/10 p-3 rounded-2xl">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Sign in with phone</CardTitle>
            <CardDescription>We&apos;ll send a one-time code to verify it&apos;s you.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12"
                />
              </div>
              <Button type="submit" className="w-full h-12">
                Send OTP
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 border-t text-center text-sm text-muted-foreground">
            <Link href="/auth/forgot-account" className="text-primary font-medium hover:underline">
              Forgot account?
            </Link>
            <div>
              New here?{" "}
              <Link href="/auth/signup" className="text-primary font-semibold hover:underline">
                Create account
              </Link>
            </div>
            <Link href="/roles" className="hover:underline">
              Choose role demo login
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
