import type { AppRole } from "@/config/role-nav";
import { DASHBOARD_ROLE_SEGMENTS } from "@/config/role-nav";

/** Resolve dashboard app role from pathname (supports /dashboard/:role/... and legacy /:role/...) */
export function pathToAppRole(pathname: string): AppRole | null {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "dashboard" && parts[1] && DASHBOARD_ROLE_SEGMENTS.includes(parts[1] as AppRole)) {
    return parts[1] as AppRole;
  }
  if (parts[0] && DASHBOARD_ROLE_SEGMENTS.includes(parts[0] as AppRole)) {
    return parts[0] as AppRole;
  }
  return null;
}
