"use client";

import { ApprovalTable } from "@/components/eco/ApprovalTable";
const mockPendingApprovals: any[] = [];

export default function SupervisorMarketplaceApprovalsPage() {
  return <ApprovalTable rows={mockPendingApprovals} />;
}
