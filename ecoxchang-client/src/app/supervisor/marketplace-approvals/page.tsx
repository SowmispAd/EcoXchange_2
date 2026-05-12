"use client";

import { ApprovalTable } from "@/components/eco/ApprovalTable";
import { mockPendingApprovals } from "@/lib/mock/data";

export default function SupervisorMarketplaceApprovalsPage() {
  return <ApprovalTable rows={mockPendingApprovals} />;
}
