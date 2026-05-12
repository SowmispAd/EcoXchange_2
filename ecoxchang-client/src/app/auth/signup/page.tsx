"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore, defaultHomeForRole } from "@/store/useAuthStore";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const { setPendingPhone } = useAuthStore();
  const [phone, setPhone] = useState("");

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    setPendingPhone(phone);
    toast.success("OTP sent (demo)");
    router.push("/auth/verify-otp?role=trial");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md border-none shadow-xl">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Phone-first signup. You&apos;ll verify with OTP next.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={go} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-12" />
            </div>
            <Button type="submit" className="w-full h-12">
              Continue
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t text-sm">
          <Link href="/auth/login" className="text-primary font-medium hover:underline">
            Already have an account?
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
