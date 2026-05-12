"use client";

import { BarChartWidget } from "@/components/dashboard/BarChartWidget";
import { PieChartWidget } from "@/components/dashboard/PieChartWidget";
import { ActivityChart } from "@/components/dashboard/ActivityChart";

const revenue = [
  { m: "Jan", a: 12, b: 8 },
  { m: "Feb", a: 18, b: 10 },
  { m: "Mar", a: 22, b: 11 },
  { m: "Apr", a: 20, b: 9 },
  { m: "May", a: 25, b: 13 },
];
const roleMix = [
  { name: "Members", value: 54 },
  { name: "Trial", value: 28 },
  { name: "Ops", value: 18 },
];
const wasteLine = [
  { name: "W1", recycled: 120 },
  { name: "W2", recycled: 132 },
  { name: "W3", recycled: 128 },
  { name: "W4", recycled: 141 },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <BarChartWidget
        title="Revenue vs rewards liability"
        description="Lakhs INR (demo)"
        data={revenue}
        xAxisKey="m"
        dataKeys={[
          { key: "a", name: "Revenue", color: "var(--primary)" },
          { key: "b", name: "Liability", color: "var(--chart-3)" },
        ]}
      />
      <div className="grid lg:grid-cols-2 gap-6">
        <PieChartWidget title="Users by role" data={roleMix} dataKey="value" nameKey="name" />
        <ActivityChart title="Waste throughput" description="Tonnes / week" data={wasteLine} dataKey="recycled" />
      </div>
    </div>
  );
}
