"use client";

import { DataTable } from "@/components/eco/DataTable";
import { mockDeliveryTasks } from "@/lib/mock/data";
import { DashboardCard } from "@/components/eco/DashboardCard";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

export default function DeliveryTasksPage() {
  return (
    <DashboardCard title="Assigned tasks">
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
        rows={mockDeliveryTasks}
        searchKeys={["user", "phone"]}
      />
      <div className="flex gap-2 mt-4">
        <Button onClick={() => toast.success("Marked complete (demo)")}>Mark first complete</Button>
      </div>
    </DashboardCard>
  );
}
