"use client";

import { DashboardCard } from "@/components/eco/DashboardCard";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function AdminSystemSettingsPage() {
  return (
    <DashboardCard title="System settings" description="Feature flags and integrations (local demo only).">
      <div className="grid gap-4 max-w-md">
        <div>
          <Label>API base URL</Label>
          <Input defaultValue={process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"} />
        </div>
        <div>
          <Label>Razorpay key id</Label>
          <Input placeholder="rzp_test_..." />
        </div>
        <Button type="button" onClick={() => toast.success("Saved locally (demo)")}>
          Save changes
        </Button>
      </div>
    </DashboardCard>
  );
}
