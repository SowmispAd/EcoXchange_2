"use client";

import { DashboardCard } from "@/components/eco/DashboardCard";
import { Badge } from "@/components/ui/badge";
import type { AppRole } from "@/config/role-nav";

const roles: { id: AppRole; label: string; desc: string }[] = [
  { id: "trial", label: "Trial", desc: "Streak onboarding" },
  { id: "member", label: "Member", desc: "Full household program" },
  { id: "supervisor", label: "Supervisor", desc: "Field verification" },
  { id: "delivery", label: "Delivery", desc: "Logistics execution" },
  { id: "recycler", label: "Recycler", desc: "Processing partner" },
  { id: "admin", label: "Admin", desc: "Platform control" },
];

export default function AdminRolesPage() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {roles.map((r) => (
        <DashboardCard key={r.id} title={r.label} description={r.desc}>
          <Badge variant="outline" className="capitalize">
            {r.id}
          </Badge>
        </DashboardCard>
      ))}
    </div>
  );
}
