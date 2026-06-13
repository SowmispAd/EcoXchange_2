"use client";

import { CalendarView } from "@/components/eco/CalendarView";
import { StatsGrid } from "@/components/eco/StatsGrid";
import { mockCalendarCollections } from "@/lib/mock/data";
import { Droplets, Package, Sparkles, Recycle } from "lucide-react";

export default function MemberCalendarPage() {
  return (
    <div className="space-y-6">
      <StatsGrid
        items={[
          { title: "Total collected", value: "86 kg", icon: Package, description: "This month" },
          { title: "Wet waste", value: "32 kg", icon: Droplets },
          { title: "Dry waste", value: "41 kg", icon: Recycle },
          { title: "EcoPoints", value: "+420", icon: Sparkles, trend: { value: 6, isPositive: true } },
        ]}
      />
      <CalendarView events={mockCalendarCollections} />
    </div>
  );
}
