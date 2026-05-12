"use client";

import { StatCard } from "@/components/dashboard/StatCard";
import type { LucideIcon } from "lucide-react";

export function StatsGrid({
  items,
}: {
  items: {
    title: string;
    value: string;
    icon: LucideIcon;
    description?: string;
    trend?: { value: number; isPositive: boolean };
  }[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {items.map((s) => (
        <StatCard key={s.title} {...s} />
      ))}
    </div>
  );
}
