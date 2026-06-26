"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardCard } from "@/components/eco/DashboardCard";
import { DataTable } from "@/components/eco/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, UserPlus, Download } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";
import { UserCreationModal } from "@/components/eco/UserCreationModal";

const roleMappings: Record<string, string> = {
  "trial-members": "trial_member",
  "permanent-members": "member",
  "supervisors": "supervisor",
  "delivery-agents": "delivery_agent",
  "recyclers": "recycler",
  "admins": "admin",
};

export default function RoleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roleSlug = Array.isArray(params.role) ? params.role[0] : params.role || "";
  const roleType = roleMappings[roleSlug];

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadUsers = async () => {
    if (!roleType) return;
    try {
      setLoading(true);
      const res = await api.get(`/admin/users?role=${roleType}`);
      if (res.data?.success) {
        setUsers(res.data.data);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load users for this role.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!roleType) {
      router.push("/admin/roles");
      return;
    }
    loadUsers();
  }, [roleType, router]);

  const handleExport = () => {
    toast.success(`Exported ${roleSlug} data to CSV`);
  };

  const rows = users.map((user) => ({
    id: user._id,
    name: user.fullName || user.name || "N/A",
    email: user.email,
    status: (
      <Badge variant={user.status === "suspended" ? "destructive" : "default"} className={user.status === "active" ? "bg-emerald-500" : ""}>
        {user.status || "active"}
      </Badge>
    ),
    joinedAt: new Date(user.createdAt || Date.now()).toLocaleDateString(),
    action: (
      <Button variant="outline" size="sm" onClick={() => toast.success(`Viewing details for ${user.fullName || user.email}`)}>
        View Profile
      </Button>
    ),
  }));

  if (!roleType) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push("/admin/roles")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Roles
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
            <UserPlus className="h-4 w-4" /> Add User
          </Button>
        </div>
      </div>

      <DashboardCard title={`${roleSlug.replace("-", " ").toUpperCase()} Management`} description={`Manage and monitor all ${roleSlug.replace("-", " ")} within the platform.`}>
        {loading ? (
          <div className="py-12 text-center text-muted-foreground animate-pulse">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">No users found for this role.</div>
        ) : (
          <div className="border border-border/50 rounded-xl overflow-hidden bg-background">
            <DataTable
              columns={[
                { key: "name", label: "Name" },
                { key: "email", label: "Email" },
                { key: "joinedAt", label: "Joined" },
                { key: "status", label: "Status" },
                { key: "action", label: "Actions" },
              ]}
              rows={rows}
              searchKeys={["name", "email"]}
            />
          </div>
        )}
      </DashboardCard>

      <UserCreationModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        defaultRole={roleType} 
        onSuccess={loadUsers} 
      />
    </div>
  );
}
