"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Leaf, ShoppingBag, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";

function getTierLabel(points: number): string {
  if (points >= 5000) return "Platinum";
  if (points >= 2500) return "Gold";
  if (points >= 1000) return "Silver";
  return "Bronze";
}

export function MemberStats() {
  const storePoints = useAuthStore((s) => s.user?.ecoPoints ?? 0);

  const { data: walletData, isLoading } = useQuery({
    queryKey: ["wallet-me"],
    queryFn: async () => {
      const res = await api.get("/wallet/me");
      return res.data.data;
    },
    retry: 1,
    staleTime: 30_000,
  });

  const ecoPoints = walletData?.ecoPointsBalance ?? storePoints ?? 0;
  const availableBalance = walletData?.availableBalance ?? 0;
  const tier = getTierLabel(ecoPoints);

  return (
    <Card className="bg-gradient-to-br from-primary to-emerald-600 text-primary-foreground border-none shadow-md overflow-hidden">
      <CardContent className="p-6 flex flex-col justify-between h-full relative">
        <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
          <Leaf className="h-32 w-32" />
        </div>
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <p className="text-sm font-medium opacity-80 mb-1">EcoPoints Balance</p>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin opacity-60" />
                <span className="text-xl opacity-60">Loading…</span>
              </div>
            ) : (
              <h3 className="text-4xl font-extrabold tracking-tight">
                {ecoPoints.toLocaleString("en-IN")}{" "}
                <span className="text-xl font-medium opacity-80">pts</span>
              </h3>
            )}
            {availableBalance > 0 && (
              <p className="text-sm mt-1 opacity-75">
                Wallet: ₹{availableBalance.toLocaleString("en-IN")}
              </p>
            )}
          </div>
          <Badge
            variant="secondary"
            className="bg-white/20 text-white hover:bg-white/30 border-none px-3 py-1 text-sm font-semibold"
          >
            {tier} Tier Member
          </Badge>
        </div>
        <div className="relative z-10 mt-6 pt-4 border-t border-white/20 flex flex-wrap gap-4">
          <Link href="/member/rewards">
            <Button size="sm" variant="secondary" className="bg-white text-primary hover:bg-white/90 font-bold">
              <ShoppingBag className="mr-2 h-4 w-4" /> Redeem Points
            </Button>
          </Link>
          <Link href="/member/tracking">
            <Button
              size="sm"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 font-bold"
            >
              View Impact History
            </Button>
          </Link>
          <Link href="/member/payments">
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/10 font-bold ml-auto"
            >
              Upgrade Membership
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
