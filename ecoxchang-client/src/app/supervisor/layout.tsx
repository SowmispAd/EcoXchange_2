"use client";

import { RoleDashboardShell } from "@/components/layout/RoleDashboardShell";

export default function SupervisorLayout({ children }: { children: React.ReactNode }) {
  return <RoleDashboardShell role="supervisor">{children}</RoleDashboardShell>;
}
