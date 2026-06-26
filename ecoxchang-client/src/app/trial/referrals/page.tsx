"use client";

import { ReferralCard } from "@/components/eco/ReferralCard";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function TrialReferralsPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["referral-stats"],
    queryFn: async () => {
      const res = await api.get("/referrals/stats");
      return res.data.data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-10 animate-pulse text-muted-foreground">Loading referral stats...</div>;
  }

  const referralStats = stats || { code: "N/A", link: "", totalReferrals: 0, successfulSignups: 0, pointsEarned: 0 };

  return <ReferralCard {...referralStats} />;
}
