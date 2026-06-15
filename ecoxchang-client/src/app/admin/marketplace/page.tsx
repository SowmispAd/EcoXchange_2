"use client";

import { useEffect, useState } from "react";
import { DashboardCard } from "@/components/eco/DashboardCard";
import { api } from "@/lib/api";

export default function AdminMarketplacePage() {
  const [analytics, setAnalytics] = useState({
    totalProductsListed: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/marketplace/analytics")
      .then((res) => {
        if (res.data?.success) {
          setAnalytics(res.data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center animate-pulse text-muted-foreground">Loading analytics...</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <DashboardCard title="Active SKUs" description="Approved listings">
        <p className="text-3xl font-bold">{analytics.totalProductsListed}</p>
      </DashboardCard>
      <DashboardCard title="Total Orders" description="All marketplace orders">
        <p className="text-3xl font-bold">{analytics.totalOrders}</p>
      </DashboardCard>
      <DashboardCard title="GMV" description="Gross Merchandise Value">
        <p className="text-3xl font-bold">₹{analytics.totalRevenue}</p>
      </DashboardCard>
    </div>
  );
}
