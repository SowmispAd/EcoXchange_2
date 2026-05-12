"use client";

import { DashboardCard } from "@/components/eco/DashboardCard";
import { useAuthStore } from "@/store/useAuthStore";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const wasteTrend = [
  { m: "Jan", kg: 8 },
  { m: "Feb", kg: 10 },
  { m: "Mar", kg: 12 },
  { m: "Apr", kg: 9 },
  { m: "May", kg: 14 },
];

export default function TrialProfilePage() {
  const { user } = useAuthStore();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <DashboardCard title="Personal" description="Phone-first identity">
        <div className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Name:</span> {user?.name}
          </p>
          <p>
            <span className="text-muted-foreground">Phone:</span> {user?.phone}
          </p>
          <p>
            <span className="text-muted-foreground">Email:</span> {user?.email || "—"}
          </p>
          <p>
            <span className="text-muted-foreground">Address:</span> {user?.address || "Add in profile completion"}
          </p>
          <Badge variant="secondary" className="mt-2">
            Trial member
          </Badge>
        </div>
      </DashboardCard>
      <DashboardCard title="Impact" description="Progress toward full membership">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>EcoPoints</span>
              <span className="font-bold">{user?.ecoPoints ?? 0}</span>
            </div>
            <Progress value={65} className="h-2" />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Monthly waste (kg)</p>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={wasteTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="m" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="kg" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.15} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}
