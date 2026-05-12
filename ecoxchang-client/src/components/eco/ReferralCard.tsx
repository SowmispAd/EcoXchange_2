"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, MessageCircle } from "lucide-react";
import { toast } from "react-hot-toast";

export function ReferralCard({
  code,
  link,
  totalReferrals,
  successfulSignups,
  pointsEarned,
}: {
  code: string;
  link: string;
  totalReferrals: number;
  successfulSignups: number;
  pointsEarned: number;
}) {
  const copy = async () => {
    await navigator.clipboard.writeText(link);
    toast.success("Referral link copied");
  };

  const wa = () => {
    const text = encodeURIComponent(`Join EcoXchange with my link: ${link}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your referral link</CardTitle>
        <CardDescription>Share and earn EcoPoints when friends complete signup.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border bg-muted/40 p-4 font-mono text-sm break-all">{link}</div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => void copy()}>
            <Copy className="mr-2 h-4 w-4" />
            Copy link
          </Button>
          <Button variant="outline" onClick={wa}>
            <MessageCircle className="mr-2 h-4 w-4" />
            WhatsApp
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{totalReferrals}</p>
            <p className="text-xs text-muted-foreground">Total invites</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{successfulSignups}</p>
            <p className="text-xs text-muted-foreground">Signups</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{pointsEarned}</p>
            <p className="text-xs text-muted-foreground">Points earned</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Your code: {code}</p>
      </CardContent>
    </Card>
  );
}
