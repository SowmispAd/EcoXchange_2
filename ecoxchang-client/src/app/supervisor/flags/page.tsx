"use client";

import { DataTable } from "@/components/eco/DataTable";
import { DashboardCard } from "@/components/eco/DashboardCard";

const flags = [
  { id: "F-01", target: "User #8821", reason: "Missorted hazardous", status: "Open" },
  { id: "F-02", target: "Agent #12", reason: "Late pickup", status: "Reviewing" },
];

export default function SupervisorFlagsPage() {
  return (
    <DashboardCard title="Flagged incidents">
      <DataTable
        columns={[
          { key: "id", label: "ID" },
          { key: "target", label: "Target" },
          { key: "reason", label: "Reason" },
          { key: "status", label: "Status" },
        ]}
        rows={flags}
      />
    </DashboardCard>
  );
}
