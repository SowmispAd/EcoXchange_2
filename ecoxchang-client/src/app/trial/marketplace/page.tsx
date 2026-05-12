"use client";

import { ProductCard } from "@/components/eco/ProductCard";
import { mockProducts } from "@/lib/mock/data";
import { DashboardCard } from "@/components/eco/DashboardCard";
import toast from "react-hot-toast";

export default function TrialMarketplacePage() {
  return (
    <div className="space-y-6">
      <DashboardCard title="Marketplace (trial)" description="Browse and buy recycled goods. Selling unlocks after membership.">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockProducts.map((p) => (
            <ProductCard
              key={p.id}
              {...p}
              onBuy={() => toast.success(`Added ${p.name} to cart (demo)`)}
              sellDisabled
              sellTooltip="Upgrade to permanent member to list products."
            />
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}
