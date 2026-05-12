"use client";

import { DashboardCard } from "@/components/eco/DashboardCard";
import { BarChartWidget } from "@/components/dashboard/BarChartWidget";

const data = [
  { name: "W1", collected: 42, missed: 3 },
  { name: "W2", collected: 48, missed: 1 },
  { name: "W3", collected: 51, missed: 2 },
  { name: "W4", collected: 46, missed: 0 },
];

export default function SupervisorReportsPage() {
  return (
    <div className="space-y-6">
      <DashboardCard title="Executive summary" description="Downloadable CSV + PDF scheduled weekly.">
        <p className="text-sm text-muted-foreground">
          SLA stable at 94%. Flagged incidents down 6% vs last month. Attach Power BI when enterprise tenant is ready.
        </p>
      </DashboardCard>
      <BarChartWidget
        title="Collections vs misses"
        description="Rolling 4 weeks"
        data={data}
        xAxisKey="name"
        dataKeys={[
          { key: "collected", name: "Collected", color: "var(--primary)" },
          { key: "missed", name: "Missed", color: "var(--destructive)" },
        ]}
      />
    </div>
  );
}
