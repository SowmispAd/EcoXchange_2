"use client";

import { DashboardCard } from "@/components/eco/DashboardCard";
import { TimelineTracker } from "@/components/eco/TimelineTracker";
const mockMemberTracking: any[] = [];

const steps = mockMemberTracking.map((s) => ({
  id: s.id,
  label: s.label,
  at: s.at,
  done: s.done,
}));

export default function MemberTrackingPage() {
  return (
    <DashboardCard title="Pickup tracking" description="Live lifecycle for your latest batch.">
      <TimelineTracker steps={steps} />
    </DashboardCard>
  );
}
