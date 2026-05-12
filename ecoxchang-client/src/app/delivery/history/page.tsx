"use client";

import { DataTable } from "@/components/eco/DataTable";
import { DashboardCard } from "@/components/eco/DashboardCard";

const history = [
  { id: "H-900", date: "2026-05-10", type: "Pickup", result: "Completed", pts: "+40" },
  { id: "H-899", date: "2026-05-09", type: "Bag drop", result: "Completed", pts: "+25" },
];

export default function DeliveryHistoryPage() {
  return (
    <DashboardCard title="Task history">
      <DataTable
        columns={[
          { key: "id", label: "ID" },
          { key: "date", label: "Date" },
          { key: "type", label: "Type" },
          { key: "result", label: "Result" },
          { key: "pts", label: "Credits" },
        ]}
        rows={history}
      />
    </DashboardCard>
  );
}
