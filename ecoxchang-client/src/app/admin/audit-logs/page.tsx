"use client";

import { DataTable } from "@/components/eco/DataTable";
import { DashboardCard } from "@/components/eco/DashboardCard";

const logs = [
  { at: "2026-05-12 08:01", actor: "admin@eco", action: "Updated role matrix", target: "roles.json" },
  { at: "2026-05-11 21:44", actor: "system", action: "Nightly reconcile", target: "payments" },
];

export default function AdminAuditLogsPage() {
  return (
    <DashboardCard title="Audit logs" description="Immutable trail once logging service is connected.">
      <DataTable
        columns={[
          { key: "at", label: "When" },
          { key: "actor", label: "Actor" },
          { key: "action", label: "Action" },
          { key: "target", label: "Target" },
        ]}
        rows={logs}
      />
    </DashboardCard>
  );
}
