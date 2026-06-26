"use client";

import { TimelineTracker, type TimelineStep } from "@/components/eco/TimelineTracker";
import { DashboardCard } from "@/components/eco/DashboardCard";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function MemberTrackingPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["member-tracking"],
    queryFn: async () => {
      const res = await api.get("/member/tracking");
      return res.data.data as TimelineStep[];
    },
  });

  if (isLoading) {
    return (
      <DashboardCard title="Active Pickup" description="Track your ongoing pickup">
        <div className="py-10 text-center animate-pulse text-muted-foreground">Loading tracking data...</div>
      </DashboardCard>
    );
  }

  const trackingSteps = data || [];

  return (
    <DashboardCard title="Active Pickup" description="Real-time status of your current or next scheduled collection.">
      {trackingSteps.length === 0 ? (
        <div className="py-10 text-center text-muted-foreground">No active pickup found. Schedule one from the dashboard.</div>
      ) : (
        <TimelineTracker steps={trackingSteps} />
      )}
    </DashboardCard>
  );
}
