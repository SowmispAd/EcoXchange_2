"use client";

import { RoleDashboardShell } from "@/components/layout/RoleDashboardShell";

export default function RecyclerLayout({ children }: { children: React.ReactNode }) {
  return <RoleDashboardShell role="recycler">{children}</RoleDashboardShell>;
}
