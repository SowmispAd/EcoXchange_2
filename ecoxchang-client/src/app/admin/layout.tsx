"use client";

import { RoleDashboardShell } from "@/components/layout/RoleDashboardShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RoleDashboardShell role="admin">{children}</RoleDashboardShell>;
}
