"use client";

import { DataTable } from "@/components/eco/DataTable";
import { DashboardCard } from "@/components/eco/DashboardCard";
import { mockRecyclerShipments } from "@/lib/mock/data";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function RecyclerShipmentsPage() {
  return (
    <DashboardCard title="Incoming shipments">
      <DataTable
        columns={[
          { key: "id", label: "Shipment" },
          { key: "from", label: "From hub" },
          { key: "weightKg", label: "Weight (kg)" },
          { key: "status", label: "Status" },
        ]}
        rows={mockRecyclerShipments}
      />
      <div className="flex gap-2 mt-4">
        <Button onClick={() => toast.success("Receipt confirmed (demo)")}>Confirm receipt</Button>
        <Button variant="outline" onClick={() => toast.success("Status updated (demo)")}>
          Update processing
        </Button>
      </div>
    </DashboardCard>
  );
}
