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
  Recycle,
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

const p = (role: AppRole, path: string) => `/${role}/${path}`;

export const NAV_BY_ROLE: Record<AppRole, NavItem[]> = {
  trial: [
    { name: "Dashboard", href: p("trial", "dashboard"), icon: LayoutDashboard },
    { name: "Schedule", href: p("trial", "schedule"), icon: Calendar },
    { name: "Marketplace", href: p("trial", "marketplace"), icon: Store },
    { name: "Profile", href: p("trial", "profile"), icon: User },
    { name: "Referrals", href: p("trial", "referrals"), icon: Users },
    { name: "Rewards", href: p("trial", "rewards"), icon: Gift },
  ],
  member: [
    { name: "Dashboard", href: p("member", "dashboard"), icon: LayoutDashboard },
    { name: "Schedule", href: p("member", "schedule"), icon: Calendar },
    { name: "Calendar", href: p("member", "calendar"), icon: CalendarDays },
    { name: "Tracking", href: p("member", "tracking"), icon: Truck },
    { name: "Referrals", href: p("member", "referrals"), icon: Users },
    { name: "Rewards", href: p("member", "rewards"), icon: Gift },
    { name: "Marketplace", href: p("member", "marketplace"), icon: Store },
    { name: "Profile", href: p("member", "profile"), icon: UserCircle },
    { name: "Payments", href: p("member", "payments"), icon: CreditCard },
  ],
  supervisor: [
    { name: "Dashboard", href: p("supervisor", "dashboard"), icon: LayoutDashboard },
    { name: "Users", href: p("supervisor", "users"), icon: Users },
    { name: "Agents", href: p("supervisor", "agents"), icon: Truck },
    { name: "Routes", href: p("supervisor", "routes"), icon: MapPin },
    { name: "Marketplace Approvals", href: p("supervisor", "marketplace-approvals"), icon: ShieldCheck },
    { name: "Flags", href: p("supervisor", "flags"), icon: Flag },
    { name: "Reports", href: p("supervisor", "reports"), icon: BarChart3 },
  ],
  delivery: [
    { name: "Dashboard", href: p("delivery", "dashboard"), icon: LayoutDashboard },
    { name: "Tasks", href: p("delivery", "tasks"), icon: Truck },
    { name: "Map", href: p("delivery", "map"), icon: MapPin },
    { name: "Scanner", href: p("delivery", "scanner"), icon: ScanLine },
    { name: "Proofs", href: p("delivery", "proofs"), icon: Camera },
    { name: "History", href: p("delivery", "history"), icon: History },
  ],
  recycler: [
    { name: "Dashboard", href: p("recycler", "dashboard"), icon: LayoutDashboard },
    { name: "Shipments", href: p("recycler", "shipments"), icon: Truck },
    { name: "Revenue", href: p("recycler", "revenue"), icon: IndianRupee },
    { name: "Payments", href: p("recycler", "payments"), icon: CreditCard },
    { name: "Reports", href: p("recycler", "reports"), icon: FileText },
  ],
  admin: [
    { name: "Dashboard", href: p("admin", "dashboard"), icon: LayoutDashboard },
    { name: "Users", href: p("admin", "users"), icon: Users },
    { name: "Roles", href: p("admin", "roles"), icon: UserCircle },
    { name: "Payments", href: p("admin", "payments"), icon: CreditCard },
    { name: "Analytics", href: p("admin", "analytics"), icon: BarChart3 },
    { name: "Marketplace", href: p("admin", "marketplace"), icon: Store },
    { name: "Rewards", href: p("admin", "rewards"), icon: Gift },
    { name: "System Settings", href: p("admin", "system-settings"), icon: Settings },
    { name: "Audit Logs", href: p("admin", "audit-logs"), icon: ScrollText },
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
  "/supervisor/marketplace-approvals": "Marketplace approvals",
  "/admin/system-settings": "System settings",
  "/admin/audit-logs": "Audit logs",
  "/delivery/scanner": "QR scanner",
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
