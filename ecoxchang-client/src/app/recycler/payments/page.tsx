"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/eco/DataTable";
import { DashboardCard } from "@/components/eco/DashboardCard";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

interface Transaction {
  _id: string;
  type: string;
  amount: number;
  source: string;
  referenceType: string;
  timestamp: string;
}

export default function RecyclerPaymentsPage() {
  const [history, setHistory] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/revenue/history");
        if (res.data?.success) {
          setHistory(res.data.data);
        }
      } catch (err) {
        toast.error("Failed to load payout histories");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const formattedRows = history.map((t) => ({
    id: t._id.slice(-6),
    type: t.type.toUpperCase(),
    source: t.source,
    amount: `₹${t.amount.toLocaleString()}`,
    date: new Date(t.timestamp).toLocaleDateString(),
    refType: t.referenceType,
  }));

  return (
    <DashboardCard title="Ledger Disbursements" description="Mirror of financial transaction database.">
      {loading ? (
        <p>Loading payouts log...</p>
      ) : (
        <DataTable
          columns={[
            { key: "id", label: "Ledger ID" },
            { key: "type", label: "Type" },
            { key: "source", label: "Category / Source" },
            { key: "amount", label: "Amount" },
            { key: "date", label: "Date" },
            { key: "refType", label: "Reference Entity" },
          ]}
          rows={formattedRows}
        />
      )}
    </DashboardCard>
  );
}
