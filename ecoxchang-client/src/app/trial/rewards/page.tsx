"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RewardCard } from "@/components/eco/RewardCard";
import { DashboardCard } from "@/components/eco/DashboardCard";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { RewardItem } from "@/types/api";

export default function TrialRewardsPage() {
  const pts = useAuthStore((s) => s.user?.ecoPoints ?? 0);

  const { data: rewardsData, isLoading } = useQuery({
    queryKey: ["rewards"],
    queryFn: async () => {
      const res = await api.get("/rewards");
      return res.data.data as RewardItem[];
    },
  });

  const handleRedeem = async (rewardId: string | undefined) => {
    if (!rewardId) return;
    try {
      const res = await api.post(`/rewards/${rewardId}/redeem`);
      if (res.data?.success) {
        toast.success("Reward redeemed successfully!");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to redeem reward");
    }
  };

  const rewards = rewardsData || [];

  return (
    <Tabs defaultValue="all" className="space-y-6">
      <TabsList className="flex flex-wrap h-auto gap-1">
        <TabsTrigger value="all">All Rewards</TabsTrigger>
        <TabsTrigger value="history">Redeemed</TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="grid sm:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="text-center py-6 text-muted-foreground col-span-2 animate-pulse">Loading rewards...</div>
        ) : rewards.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground col-span-2">No rewards available at the moment.</div>
        ) : (
          rewards.map((reward) => (
            <RewardCard
              key={reward._id || reward.id}
              title={reward.title || reward.name || "Reward"}
              description={reward.image || "A valuable reward for your EcoPoints."}
              costPoints={reward.pointsRequired || reward.points || 0}
              eligible={pts >= (reward.pointsRequired || reward.points || 0)}
              onRedeem={() => handleRedeem(reward._id || reward.id)}
            />
          ))
        )}
      </TabsContent>
      <TabsContent value="history">
        <DashboardCard title="Redeemed history" description="No redemptions yet — your history will show here." />
      </TabsContent>
    </Tabs>
  );
}
