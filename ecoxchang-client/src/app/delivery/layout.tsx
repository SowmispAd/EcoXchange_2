"use client";

import { RoleDashboardShell } from "@/components/layout/RoleDashboardShell";

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  return <RoleDashboardShell role="delivery">{children}</RoleDashboardShell>;
}
