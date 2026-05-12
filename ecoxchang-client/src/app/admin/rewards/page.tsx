"use client";

import { BarChartWidget } from "@/components/dashboard/BarChartWidget";

const redeemed = [
  { name: "Jan", count: 120 },
  { name: "Feb", count: 132 },
  { name: "Mar", count: 118 },
  { name: "Apr", count: 140 },
  { name: "May", count: 151 },
];

export default function AdminRewardsPage() {
  return (
    <BarChartWidget
      title="Rewards redeemed"
      description="Vouchers issued per month (demo)."
      data={redeemed}
      xAxisKey="name"
      dataKeys={[{ key: "count", name: "Redemptions", color: "var(--chart-4)" }]}
    />
  );
}
