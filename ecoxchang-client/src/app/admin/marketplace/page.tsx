"use client";

import { DashboardCard } from "@/components/eco/DashboardCard";
import { mockProducts } from "@/lib/mock/data";

export default function AdminMarketplacePage() {
  const gmv = mockProducts.reduce((s, p) => s + p.price, 0);
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <DashboardCard title="Active SKUs" description="Approved listings">
        <p className="text-3xl font-bold">{mockProducts.length}</p>
      </DashboardCard>
      <DashboardCard title="GMV (demo)" description="Listed value sample">
        <p className="text-3xl font-bold">₹{gmv}</p>
      </DashboardCard>
      <DashboardCard title="Pending approvals" description="Supervisor queue">
        <p className="text-3xl font-bold">2</p>
      </DashboardCard>
    </div>
  );
}
