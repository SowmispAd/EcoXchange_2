"use client";

import { DataTable } from "@/components/eco/DataTable";
import { DashboardCard } from "@/components/eco/DashboardCard";

const agents = [
  { name: "Kiran V.", phone: "+91 77001", status: "Online", route: "R12" },
  { name: "Neha M.", phone: "+91 77002", status: "Break", route: "R08" },
];

export default function SupervisorAgentsPage() {
  return (
    <DashboardCard title="Delivery agents" description="Monitor availability and flag incidents.">
      <DataTable
        columns={[
          { key: "name", label: "Agent" },
          { key: "phone", label: "Phone" },
          { key: "status", label: "Status" },
          { key: "route", label: "Route" },
        ]}
        rows={agents}
        searchKeys={["name", "route"]}
      />
    </DashboardCard>
  );
}
