"use client";

import { ReferralCard } from "@/components/eco/ReferralCard";
import { mockReferralStats } from "@/lib/mock/data";

export default function MemberReferralsPage() {
  return <ReferralCard {...mockReferralStats} />;
}
