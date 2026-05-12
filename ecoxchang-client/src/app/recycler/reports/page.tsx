"use client";

import { ActivityChart } from "@/components/dashboard/ActivityChart";

const tonnage = [
  { name: "Jan", recycled: 40 },
  { name: "Feb", recycled: 52 },
  { name: "Mar", recycled: 48 },
  { name: "Apr", recycled: 61 },
  { name: "May", recycled: 55 },
];

export default function RecyclerReportsPage() {
  return (
    <ActivityChart
      title="Processing throughput"
      description="Tonnes prepared for offtake (demo series)."
      data={tonnage}
      dataKey="recycled"
    />
  );
}
