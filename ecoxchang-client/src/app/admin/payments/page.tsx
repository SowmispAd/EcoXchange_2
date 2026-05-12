"use client";

import { DataTable } from "@/components/eco/DataTable";
import { DashboardCard } from "@/components/eco/DashboardCard";

const rows = [
  { id: "RZP-9001", party: "Member upgrade", amount: "₹300", when: "2026-05-11", state: "Captured" },
  { id: "RZP-9000", party: "Marketplace", amount: "₹1,299", when: "2026-05-10", state: "Captured" },
];

export default function AdminPaymentsPage() {
  return (
    <DashboardCard title="Payments" description="Razorpay test mode compatible payloads.">
      <DataTable
        columns={[
          { key: "id", label: "Txn" },
          { key: "party", label: "Party" },
          { key: "amount", label: "Amount" },
          { key: "when", label: "When" },
          { key: "state", label: "State" },
        ]}
        rows={rows}
      />
    </DashboardCard>
  );
}
