"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/eco/DataTable";
import { DashboardCard } from "@/components/eco/DashboardCard";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

interface TaskRow extends Record<string, unknown> {
  id: string;
  user: string;
  phone: string;
  address: string;
  type: string;
  window: string;
  status: string;
}

interface BackendTask {
  _id: string;
  user?: { fullName?: string; phoneNumber?: string };
  address: string;
  wasteType: string;
  scheduledDate: string;
  status: string;
}

export default function DeliveryTasksPage() {
  const [rows, setRows] = useState<TaskRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/delivery/tasks")
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          const formatted = (res.data.data as BackendTask[]).map((t) => ({
            id: t._id,
            user: t.user?.fullName || "EcoXchange Customer",
            phone: t.user?.phoneNumber || "N/A",
            address: t.address,
            type: t.wasteType.toUpperCase(),
            window: new Date(t.scheduledDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            status: t.status.replace("_", " "),
          }));
          setRows(formatted);
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to load assigned tasks");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <DashboardCard title="Assigned Tasks" description="View all tasks currently assigned to your route.">
      {loading ? (
        <div className="text-center py-6 text-muted-foreground animate-pulse">Loading tasks from API...</div>
      ) : (
        <DataTable
          columns={[
            { key: "id", label: "ID" },
            { key: "user", label: "User" },
            { key: "phone", label: "Phone" },
            { key: "address", label: "Address" },
            { key: "type", label: "Type" },
            { key: "window", label: "Window" },
            { key: "status", label: "Status" },
          ]}
          rows={rows}
          searchKeys={["user", "phone", "address"]}
        />
      )}
    </DashboardCard>
  );
}
