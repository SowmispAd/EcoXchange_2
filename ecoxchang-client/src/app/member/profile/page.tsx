"use client";

import { DashboardCard } from "@/components/eco/DashboardCard";
import { useAuthStore } from "@/store/useAuthStore";
import { Badge } from "@/components/ui/badge";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const waste = [
  { m: "Jan", kg: 14 },
  { m: "Feb", kg: 18 },
  { m: "Mar", kg: 16 },
  { m: "Apr", kg: 22 },
  { m: "May", kg: 20 },
];
const points = [
  { m: "Jan", pts: 120 },
  { m: "Feb", pts: 200 },
  { m: "Mar", pts: 260 },
  { m: "Apr", pts: 310 },
  { m: "May", pts: 380 },
];

export default function MemberProfilePage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard title="Personal information">
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
              <span className="text-muted-foreground">Address:</span> {user?.address || "—"}
            </p>
            <Badge>Permanent member</Badge>
          </div>
        </DashboardCard>
        <DashboardCard title="Achievements">
          <div className="flex flex-wrap gap-2">
            {["5-week streak", "Top recycler", "Referral champion"].map((b) => (
              <Badge key={b} variant="outline" className="rounded-full">
                {b}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Total waste contributed: <strong>142 kg</strong> · CO₂ saved est. <strong>58 kg</strong>
          </p>
        </DashboardCard>
      </div>
      <DashboardCard title="Monthly waste (kg)">
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={waste}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="m" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="kg" fill="var(--primary)" name="Waste" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>
      <DashboardCard title="Eco points trend">
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="m" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="pts" stroke="var(--chart-2)" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>
    </div>
  );
}
