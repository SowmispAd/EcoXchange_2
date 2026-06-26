"use client";

import { CalendarView } from "@/components/eco/CalendarView";
import { StatsGrid } from "@/components/eco/StatsGrid";
import { Droplets, Package, Sparkles, Recycle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useMemo } from "react";
import type { Pickup } from "@/types/api";

export default function MemberCalendarPage() {
  const { data: pickupsData } = useQuery({
    queryKey: ["my-pickups"],
    queryFn: async () => {
      const res = await api.get("/pickups/my");
      return res.data.data as Pickup[];
    },
  });

  const calendarEvents = useMemo(() => {
    if (!pickupsData) return [];
    return pickupsData
      .filter((p) => p.scheduledDate ?? p.createdAt)
      .map((p) => ({
        date: new Date(p.scheduledDate ?? p.createdAt!).toISOString().slice(0, 10),
        type: p.wasteType ?? p.type ?? "Pickup",
      }));
  }, [pickupsData]);

  const completed = useMemo(
    () => pickupsData?.filter((p) => p.status === "completed") ?? [],
    [pickupsData]
  );
  const totalKg = completed.reduce(
    (sum, p) => sum + (Number(p.actualWeight) || Number(p.weight) || 0),
    0
  );
  const totalPoints = completed.reduce(
    (s, p) => s + (p.ecoPointsAwarded ?? p.earnedPoints ?? p.points ?? 0),
    0
  );

  return (
    <div className="space-y-6">
      <StatsGrid
        items={[
          { title: "Total collected", value: `${totalKg} kg`, icon: Package, description: "Completed pickups" },
          { title: "Wet waste", value: `${completed.filter((p) => (p.wasteType ?? p.type ?? "").toLowerCase().includes("wet")).length} pickups`, icon: Droplets },
          { title: "Dry waste", value: `${completed.filter((p) => (p.wasteType ?? p.type ?? "").toLowerCase().includes("dry")).length} pickups`, icon: Recycle },
          { title: "EcoPoints", value: `+${totalPoints}`, icon: Sparkles },
        ]}
      />
      <CalendarView events={calendarEvents} />
    </div>
  );
}
