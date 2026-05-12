"use client";

import { DataTable } from "@/components/eco/DataTable";
import { DashboardCard } from "@/components/eco/DashboardCard";

const trialUsers = [
  { name: "Riya K.", phone: "+91 90001", streak: "3/5", zone: "North" },
  { name: "Dev P.", phone: "+91 90002", streak: "1/5", zone: "East" },
];
const members = [
  { name: "Meera S.", phone: "+91 80001", points: "2.1k", zone: "Central" },
  { name: "Arjun L.", phone: "+91 80002", points: "3.4k", zone: "West" },
];

export default function SupervisorUsersPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <DashboardCard title="Trial users">
        <DataTable
          columns={[
            { key: "name", label: "Name" },
            { key: "phone", label: "Phone" },
            { key: "streak", label: "Streak" },
            { key: "zone", label: "Zone" },
          ]}
          rows={trialUsers}
          searchKeys={["name", "phone"]}
        />
      </DashboardCard>
      <DashboardCard title="Permanent members">
        <DataTable
          columns={[
            { key: "name", label: "Name" },
            { key: "phone", label: "Phone" },
            { key: "points", label: "EcoPoints" },
            { key: "zone", label: "Zone" },
          ]}
          rows={members}
          searchKeys={["name"]}
        />
      </DashboardCard>
    </div>
  );
}
