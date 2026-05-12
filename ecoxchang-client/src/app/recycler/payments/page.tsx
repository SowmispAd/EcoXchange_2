"use client";

import { DataTable } from "@/components/eco/DataTable";
import { DashboardCard } from "@/components/eco/DashboardCard";

const payouts = [
  { id: "P-77", recycler: "GreenCycle", amount: "₹1,20,000", date: "2026-05-01", status: "Settled" },
  { id: "P-76", recycler: "GreenCycle", amount: "₹98,000", date: "2026-04-15", status: "Settled" },
];

export default function RecyclerPaymentsPage() {
  return (
    <DashboardCard title="Payments made" description="Mirror of finance disbursements.">
      <DataTable
        columns={[
          { key: "id", label: "Payout" },
          { key: "recycler", label: "Partner" },
          { key: "amount", label: "Amount" },
          { key: "date", label: "Date" },
          { key: "status", label: "Status" },
        ]}
        rows={payouts}
      />
    </DashboardCard>
  );
}
