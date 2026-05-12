"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RewardCard } from "@/components/eco/RewardCard";
import { DashboardCard } from "@/components/eco/DashboardCard";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";

export default function MemberRewardsPage() {
  const pts = useAuthStore((s) => s.user?.ecoPoints ?? 0);

  return (
    <Tabs defaultValue="discounts" className="space-y-6">
      <TabsList className="flex flex-wrap h-auto gap-1">
        <TabsTrigger value="discounts">Discounts</TabsTrigger>
        <TabsTrigger value="cashback">Cashback</TabsTrigger>
        <TabsTrigger value="refills">Free refills</TabsTrigger>
        <TabsTrigger value="history">Redeemed history</TabsTrigger>
      </TabsList>
      <TabsContent value="discounts" className="grid sm:grid-cols-2 gap-4">
        <RewardCard
          title="Member disposal kit 15% off"
          description="Bags + stickers bundle."
          costPoints={400}
          eligible={pts >= 400}
          onRedeem={() => toast.success("Discount unlocked (demo)")}
        />
        <RewardCard
          title="Partner café voucher"
          description="₹100 off with 800 pts."
          costPoints={800}
          eligible={pts >= 800}
          onRedeem={() => toast.success("Voucher sent (demo)")}
        />
      </TabsContent>
      <TabsContent value="cashback">
        <DashboardCard title="Cashback" description="Campaigns will appear when finance enables them." />
      </TabsContent>
      <TabsContent value="refills">
        <RewardCard
          title="Free refill"
          description="One visit per 600 pts."
          costPoints={600}
          eligible={pts >= 600}
          onRedeem={() => toast.success("Slot booked (demo)")}
        />
      </TabsContent>
      <TabsContent value="history">
        <DashboardCard title="Redeemed" description="May 2026 — disposal kit discount (demo entry)." />
      </TabsContent>
    </Tabs>
  );
}
