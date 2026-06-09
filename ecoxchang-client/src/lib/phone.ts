/**
 * Normalizes a raw phone number input into standard E.164 format.
 *
 * Requirements:
 * - Remove spaces, brackets, hyphens
 * - Remove duplicate "+" (sanitize to single leading plus if present)
 * - Auto-prepend +91 for 10-digit Indian numbers
 * - Convert 91XXXXXXXXXX -> +91XXXXXXXXXX
 * - Validate that only numeric content remains (excluding leading +)
 * - Enforce length limits (7 to 15 digits total)
 */
export function normalizePhoneNumber(phone: string): string {
  if (!phone || typeof phone !== "string") {
    throw new Error("Phone number is required");
  }

  // Remove spaces, brackets, hyphens, and trim
  const cleaned = phone.trim().replace(/[\s()\-]/g, "");

  // Verify only numeric characters remain (except optional single leading +)
  const hasLeadingPlus = cleaned.startsWith("+");
  const numericPart = hasLeadingPlus ? cleaned.slice(1) : cleaned;

  if (!/^\d+$/.test(numericPart)) {
    throw new Error("Phone number contains invalid non-numeric characters");
  }

  const digits = numericPart;

  let normalized = "";

  // 1. Auto-prepend +91 for 10-digit Indian numbers
  if (digits.length === 10) {
    normalized = `+91${digits}`;
  }
  // 2. Convert 91XXXXXXXXXX -> +91XXXXXXXXXX (12 digits starting with 91)
  else if (digits.length === 12 && digits.startsWith("91")) {
    normalized = `+${digits}`;
  }
  // 3. Otherwise construct with leading plus if either it originally had one or we normalize general format
  else {
    normalized = `+${digits}`;
  }

  // Enforce length check (excluding the leading '+')
  const finalDigitsCount = normalized.replace(/\D/g, "").length;
  if (finalDigitsCount < 7 || finalDigitsCount > 15) {
    throw new Error(`Invalid phone number length (${finalDigitsCount} digits). It must be between 7 and 15 digits.`);
  }

  return normalized;
}
