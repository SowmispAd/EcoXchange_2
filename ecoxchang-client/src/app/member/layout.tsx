"use client";

import { RoleDashboardShell } from "@/components/layout/RoleDashboardShell";

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return <RoleDashboardShell role="member">{children}</RoleDashboardShell>;
}
