"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/eco/DataTable";
import { DashboardCard } from "@/components/eco/DashboardCard";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

interface HistoryRow extends Record<string, unknown> {
  id: string;
  date: string;
  type: string;
  result: string;
  pts: string;
}

interface BackendTask {
  _id: string;
  status: string;
  updatedAt?: string;
  createdAt: string;
  wasteType: string;
  ecoPointsAwarded?: number;
}

export default function DeliveryHistoryPage() {
  const [rows, setRows] = useState<HistoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/delivery/tasks")
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          const completed = (res.data.data as BackendTask[]).filter(
            (t) => t.status === "completed" || t.status === "cancelled" || t.status === "failed"
          );
          const formatted = completed.map((t) => ({
            id: t._id,
            date: new Date(t.updatedAt || t.createdAt).toLocaleDateString(),
            type: `${t.wasteType.toUpperCase()} collection`,
            result: t.status.toUpperCase(),
            pts: t.ecoPointsAwarded ? `+${t.ecoPointsAwarded}` : "0",
          }));
          setRows(formatted);
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to load task history");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <DashboardCard title="Task History" description="View details of your past pickups and collections.">
      {loading ? (
        <div className="text-center py-6 text-muted-foreground animate-pulse">Loading history...</div>
      ) : (
        <DataTable
          columns={[
            { key: "id", label: "ID" },
            { key: "date", label: "Date" },
            { key: "type", label: "Type" },
            { key: "result", label: "Result" },
            { key: "pts", label: "Credits" },
          ]}
          rows={rows}
        />
      )}
    </DashboardCard>
  );
}
