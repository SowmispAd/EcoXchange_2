"use client";

import { DashboardCard } from "@/components/eco/DashboardCard";
import { PieChartWidget } from "@/components/dashboard/PieChartWidget";

const mix = [
  { name: "PET", value: 35 },
  { name: "HDPE", value: 28 },
  { name: "Metal", value: 22 },
  { name: "Glass", value: 15 },
];

export default function RecyclerRevenuePage() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <DashboardCard title="Revenue (demo)" description="Enter amounts in finance module when live.">
        <p className="text-3xl font-bold">₹4.2L</p>
        <p className="text-sm text-muted-foreground mt-2">Last 30 days · reconciled weekly</p>
      </DashboardCard>
      <PieChartWidget title="Material mix" description="By weight" data={mix} dataKey="value" nameKey="name" />
    </div>
  );
}
