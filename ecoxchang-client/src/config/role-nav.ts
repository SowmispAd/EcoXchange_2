import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Calendar,
  CalendarDays,
  Store,
  User,
  Users,
  Gift,
  UserCircle,
  Truck,
  MapPin,
  ScanLine,
  Camera,
  History,
  ShieldCheck,
  Flag,
  BarChart3,
  IndianRupee,
  CreditCard,
  FileText,
  Settings,
  ScrollText,
} from "lucide-react";

export type AppRole =
  | "trial"
  | "member"
  | "supervisor"
  | "delivery"
  | "recycler"
  | "admin";

export type NavItem = { name: string; href: string; icon: LucideIcon };

/** Canonical dashboard URL segment (browser-visible path). Rewrites map `/dashboard/...` → app routes under `/:role/...`. */
export function dashboardPath(role: AppRole, segment: string): string {
  return `/dashboard/${role}/${segment}`;
}

export const NAV_BY_ROLE: Record<AppRole, NavItem[]> = {
  trial: [
    { name: "Dashboard", href: "/trial/dashboard", icon: LayoutDashboard },
    { name: "Schedule", href: "/trial/schedule", icon: Calendar },
    { name: "Marketplace", href: "/trial/marketplace", icon: Store },
    { name: "Rewards", href: "/trial/rewards", icon: Gift },
    { name: "Profile", href: "/trial/profile", icon: User },
  ],
  member: [
    { name: "Dashboard", href: "/member/dashboard", icon: LayoutDashboard },
    { name: "Schedule", href: "/member/schedule", icon: Calendar },
    { name: "Calendar", href: "/member/calendar", icon: CalendarDays },
    { name: "Tracking", href: "/member/tracking", icon: Truck },
    { name: "Referrals", href: "/member/referrals", icon: Users },
    { name: "Rewards", href: "/member/rewards", icon: Gift },
    { name: "Marketplace", href: "/member/marketplace", icon: Store },
    { name: "Profile", href: "/member/profile", icon: UserCircle },
    { name: "Payments", href: "/member/payments", icon: CreditCard },
  ],
  supervisor: [
    { name: "Dashboard", href: "/supervisor/dashboard", icon: LayoutDashboard },
    { name: "Users", href: "/supervisor/users", icon: Users },
    { name: "Agents", href: "/supervisor/agents", icon: Truck },
    { name: "Routes", href: "/supervisor/routes", icon: MapPin },
    { name: "Marketplace Approvals", href: "/supervisor/marketplace-approvals", icon: ShieldCheck },
    { name: "Flags", href: "/supervisor/flags", icon: Flag },
    { name: "Reports", href: "/supervisor/reports", icon: BarChart3 },
  ],
  delivery: [
    { name: "Dashboard", href: "/delivery/dashboard", icon: LayoutDashboard },
    { name: "Tasks", href: "/delivery/tasks", icon: Truck },
    { name: "Map", href: "/delivery/map", icon: MapPin },
    { name: "Scanner", href: "/delivery/scanner", icon: ScanLine },
    { name: "Proofs", href: "/delivery/proofs", icon: Camera },
    { name: "History", href: "/delivery/history", icon: History },
  ],
  recycler: [
    { name: "Dashboard", href: "/recycler/dashboard", icon: LayoutDashboard },
    { name: "Shipments", href: "/recycler/shipments", icon: Truck },
    { name: "Revenue", href: "/recycler/revenue", icon: IndianRupee },
    { name: "Payments", href: "/recycler/payments", icon: CreditCard },
    { name: "Reports", href: "/recycler/reports", icon: FileText },
  ],
  admin: [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Roles", href: "/admin/roles", icon: UserCircle },
    { name: "Payments", href: "/admin/payments", icon: CreditCard },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Marketplace", href: "/admin/marketplace", icon: Store },
    { name: "Rewards", href: "/admin/rewards", icon: Gift },
    { name: "System Settings", href: "/admin/system-settings", icon: Settings },
    { name: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
  ],
};

export const ROLE_HOME: Record<AppRole, string> = {
  trial: "/trial/dashboard",
  member: "/member/dashboard",
  supervisor: "/supervisor/dashboard",
  delivery: "/delivery/dashboard",
  recycler: "/recycler/dashboard",
  admin: "/admin/dashboard",
};

const TITLE_OVERRIDES: Record<string, string> = {
  "/trial/marketplace": "Marketplace",
  "/member/marketplace": "Marketplace",
  "/supervisor/marketplace-approvals": "Marketplace Approvals",
  "/admin/system-settings": "System Settings",
  "/admin/audit-logs": "Audit Logs",
  "/delivery/scanner": "QR Scanner",
};


export function getDashboardTitle(pathname: string): string {
  if (TITLE_OVERRIDES[pathname]) return TITLE_OVERRIDES[pathname];
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length < 2) return "Dashboard";
  const leaf = parts[parts.length - 1];
  if (leaf === "dashboard") return "Dashboard";
  return leaf
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export const DASHBOARD_ROLE_SEGMENTS: AppRole[] = [
  "admin",
  "supervisor",
  "delivery",
  "recycler",
  "trial",
  "member",
];
