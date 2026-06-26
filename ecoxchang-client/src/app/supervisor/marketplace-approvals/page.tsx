"use client";

import { ApprovalTable, type ApprovalRow } from "@/components/eco/ApprovalTable";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function SupervisorMarketplaceApprovalsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["marketplace-approvals"],
    queryFn: async () => {
      const res = await api.get("/marketplace/approvals");
      return res.data.data as ApprovalRow[];
    },
  });

  if (isLoading) {
    return <div className="text-center py-10 animate-pulse text-muted-foreground">Loading approvals...</div>;
  }

  const approvals = data || [];

  return <ApprovalTable rows={approvals} />;
}
