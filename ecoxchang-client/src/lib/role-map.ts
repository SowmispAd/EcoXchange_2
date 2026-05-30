import type { AppRole } from "@/config/role-nav";

/** Maps backend JWT `user.role` to frontend dashboard role segment */
const API_TO_APP: Record<string, AppRole> = {
  trial_member: "trial",
  member: "member",
  supervisor: "supervisor",
  delivery_agent: "delivery",
  recycler: "recycler",
  admin: "admin",
  /** Some collections use plain role strings */
  trial: "trial",
  citizen: "member",
};

export function toAppRole(apiRole: string): AppRole {
  return API_TO_APP[apiRole] ?? "member";
}
