"use client";

import { ReferralCard } from "@/components/eco/ReferralCard";
import { mockReferralStats } from "@/lib/mock/data";

export default function TrialReferralsPage() {
  return <ReferralCard {...mockReferralStats} />;
}
