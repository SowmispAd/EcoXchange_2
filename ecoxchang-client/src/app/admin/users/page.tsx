"use client";

import { DataTable } from "@/components/eco/DataTable";
import { DashboardCard } from "@/components/eco/DashboardCard";

const users = [
  { id: "U-1", name: "Trial pool", role: "trial", count: "1,204" },
  { id: "U-2", name: "Members", role: "member", count: "8,910" },
  { id: "U-3", name: "Staff", role: "supervisor", count: "42" },
];

export default function AdminUsersPage() {
  return (
    <DashboardCard title="Users by segment" description="Aggregated directory until user service pagination ships.">
      <DataTable
        columns={[
          { key: "id", label: "ID" },
          { key: "name", label: "Segment" },
          { key: "role", label: "Role key" },
          { key: "count", label: "Count" },
        ]}
        rows={users}
      />
    </DashboardCard>
  );
}
