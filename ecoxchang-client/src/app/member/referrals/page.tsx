"use client";

import { ReferralCard } from "@/components/eco/ReferralCard";
const mockReferralStats = { code: "ECO-MEMBER", totalReferred: 0, pointsEarned: 0, pending: 0 };

export default function MemberReferralsPage() {
  return <ReferralCard {...mockReferralStats} />;
}
