/** Normalize to E.164-style `+` + digits (matches server `phoneUtils`) */
export function normalizePhone(input: string): string {
  if (!input || typeof input !== "string") return "";
  const digits = input.replace(/\D/g, "");
  if (!digits) return "";
  if (input.trim().startsWith("+")) return `+${digits}`;
  if (digits.length === 10) return `+91${digits}`;
  return `+${digits}`;
}
