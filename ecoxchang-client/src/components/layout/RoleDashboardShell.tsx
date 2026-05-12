"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { usePathname } from "next/navigation";
import { getDashboardTitle, type AppRole } from "@/config/role-nav";

export function RoleDashboardShell({
  role,
  children,
}: {
  role: AppRole;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const title = getDashboardTitle(pathname);

  return <DashboardLayout title={title}>{children}</DashboardLayout>;
}
