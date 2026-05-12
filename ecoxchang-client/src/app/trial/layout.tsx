"use client";

import { RoleDashboardShell } from "@/components/layout/RoleDashboardShell";

export default function TrialLayout({ children }: { children: React.ReactNode }) {
  return <RoleDashboardShell role="trial">{children}</RoleDashboardShell>;
}
