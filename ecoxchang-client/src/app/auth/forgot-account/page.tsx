"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ForgotAccountPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md border-none shadow-xl">
        <CardHeader>
          <CardTitle>Forgot account</CardTitle>
          <CardDescription>
            Enter the phone you used previously. We&apos;ll text you a recovery link when the backend endpoint is wired.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/auth/login" className={cn(buttonVariants(), "inline-flex w-full justify-center no-underline")}>
            Back to phone login
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
