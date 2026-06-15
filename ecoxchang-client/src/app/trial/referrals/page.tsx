"use client";

import { ReferralCard } from "@/components/eco/ReferralCard";
const mockReferralStats = { code: "ECO-TRIAL", totalReferred: 0, pointsEarned: 0, pending: 0 };

export default function TrialReferralsPage() {
  return <ReferralCard {...mockReferralStats} />;
}
