import type { User } from "@/store/useAuthStore";
import { toAppRole } from "@/lib/role-map";

/** Backend user document → Zustand `User` */
export function mapApiUserToStore(
  u: Record<string, unknown> & { _id?: unknown },
  _modelName?: string,
): User {
  const id = String(u._id ?? u.id ?? "");
  const apiRole = String(u.role ?? "citizen");
  const streak =
    typeof u.streakCount === "number"
      ? u.streakCount
      : typeof u.streak === "number"
        ? u.streak
        : 0;
  
  const membershipStatus =
    u.membershipStatus === "trial"
      ? "trial"
      : u.membershipStatus === "member" || u.membershipStatus === "active"
        ? "member"
        : "trial";

  let finalRole = toAppRole(apiRole);
  if (apiRole === "citizen" || apiRole === "member" || apiRole === "trial_member") {
    finalRole = membershipStatus === "trial" ? "trial" : "member";
  }

  return {
    id,
    name: String(u.fullName ?? u.name ?? "User"),
    email: u.email ? String(u.email) : undefined,
    phone: String(u.phoneNumber ?? u.phone ?? ""),
    role: finalRole,
    avatar: u.avatar ? String(u.avatar) : undefined,
    ecoPoints: typeof u.ecoPoints === "number" ? u.ecoPoints : 0,
    streak,
    address: u.address ? String(u.address) : undefined,
    membershipStatus,
  };
}
