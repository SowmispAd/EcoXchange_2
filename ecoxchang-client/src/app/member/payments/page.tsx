"use client";

import { DataTable } from "@/components/eco/DataTable";
import { DashboardCard } from "@/components/eco/DashboardCard";

const rows = [
  { id: "INV-01", date: "2026-04-02", desc: "Annual membership", amount: "₹300", status: "Paid" },
  { id: "INV-02", date: "2026-05-01", desc: "Eco kit add-on", amount: "₹120", status: "Paid" },
];

export default function MemberPaymentsPage() {
  return (
    <DashboardCard title="Payments" description="Razorpay-ready when backend keys are configured.">
      <DataTable
        columns={[
          { key: "id", label: "Invoice" },
          { key: "date", label: "Date" },
          { key: "desc", label: "Description" },
          { key: "amount", label: "Amount" },
          { key: "status", label: "Status" },
        ]}
        rows={rows}
        searchKeys={["id", "desc"]}
      />
    </DashboardCard>
  );
}
