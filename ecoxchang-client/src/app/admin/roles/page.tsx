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

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminRolesPage() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {roles.map((r) => {
        // Map app roles to URL slugs
        const slugMap: Record<string, string> = {
          trial: "trial-members",
          member: "permanent-members",
          supervisor: "supervisors",
          delivery: "delivery-agents",
          recycler: "recyclers",
          admin: "admins",
        };
        const slug = slugMap[r.id] || "users";

        return (
          <DashboardCard key={r.id} title={r.label} description={r.desc}>
            <div className="flex justify-between items-center mt-4">
              <Badge variant="outline" className="capitalize">
                {r.id}
              </Badge>
              <Link href={`/admin/roles/${slug}`}>
                <Button variant="secondary" size="sm">Manage Users</Button>
              </Link>
            </div>
          </DashboardCard>
        );
      })}
    </div>
  );
}
