"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RewardCard } from "@/components/eco/RewardCard";
import { DashboardCard } from "@/components/eco/DashboardCard";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";

export default function TrialRewardsPage() {
  const pts = useAuthStore((s) => s.user?.ecoPoints ?? 0);

  return (
    <Tabs defaultValue="discounts" className="space-y-6">
      <TabsList className="flex flex-wrap h-auto gap-1">
        <TabsTrigger value="discounts">Discounts</TabsTrigger>
        <TabsTrigger value="cashback">Cashback</TabsTrigger>
        <TabsTrigger value="refills">Free refills</TabsTrigger>
        <TabsTrigger value="history">Redeemed</TabsTrigger>
      </TabsList>
      <TabsContent value="discounts" className="grid sm:grid-cols-2 gap-4">
        <RewardCard
          title="Disposal bags 10% off"
          description="Applies at checkout for certified members."
          costPoints={200}
          eligible={pts >= 200}
          onRedeem={() => toast.success("Voucher added (demo)")}
        />
        <RewardCard
          title="QR stickers bundle"
          description="Eco-pack for home segregation."
          costPoints={350}
          eligible={pts >= 350}
          onRedeem={() => toast.success("Reserved (demo)")}
        />
      </TabsContent>
      <TabsContent value="cashback">
        <DashboardCard title="Cashback" description="Cashback offers appear here when campaigns are active." />
      </TabsContent>
      <TabsContent value="refills">
        <RewardCard
          title="Free refill station visit"
          description="Eligible when you hold 500+ EcoPoints."
          costPoints={500}
          eligible={pts >= 500}
          onRedeem={() => toast.success("Booked (demo)")}
        />
      </TabsContent>
      <TabsContent value="history">
        <DashboardCard title="Redeemed history" description="No redemptions yet — your history will show here." />
      </TabsContent>
    </Tabs>
  );
}
