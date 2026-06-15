"use client";

import { useEffect, useState } from "react";
import { DashboardCard } from "@/components/eco/DashboardCard";
import { DataTable } from "@/components/eco/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

interface User {
  _id: string;
  name?: string;
  fullName?: string;
  email: string;
  role: string;
  status: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");
      if (res.data?.success) {
        setUsers(res.data.data);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      if (res.data?.success) {
        toast.success("Role updated successfully");
        loadUsers();
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to update role");
    }
  };

  const toggleStatus = async (user: User) => {
    try {
      const action = user.status === "suspended" ? "restore" : "suspend";
      const res = await api.patch(`/admin/users/${user._id}/${action}`);
      if (res.data?.success) {
        toast.success(`User ${action}ed successfully`);
        loadUsers();
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const rows = users.map(user => ({
    id: user._id,
    name: user.fullName || user.name || "N/A",
    email: user.email,
    role: (
      <Select defaultValue={user.role} onValueChange={(val: string) => handleRoleChange(user._id, val)}>
        <SelectTrigger className="w-[150px] h-8 bg-background border-primary/20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="supervisor">Supervisor</SelectItem>
          <SelectItem value="delivery_agent">Delivery Agent</SelectItem>
          <SelectItem value="recycler">Recycler</SelectItem>
          <SelectItem value="member">Permanent Member</SelectItem>
          <SelectItem value="trial_member">Trial Member</SelectItem>
          <SelectItem value="citizen">Citizen</SelectItem>
        </SelectContent>
      </Select>
    ),
    status: (
      <Badge variant={user.status === "suspended" ? "destructive" : "default"} className={user.status === "active" ? "bg-emerald-500" : ""}>
        {user.status || "active"}
      </Badge>
    ),
    action: (
      <Button 
        variant={user.status === "suspended" ? "default" : "destructive"} 
        size="sm"
        onClick={() => toggleStatus(user)}
      >
        {user.status === "suspended" ? "Restore" : "Suspend"}
      </Button>
    )
  }));

  return (
    <DashboardCard title="User Management" description="Manage all users, roles, and access across the EcoXchange platform.">
      {loading ? (
        <div className="py-12 text-center text-muted-foreground animate-pulse">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">No users found.</div>
      ) : (
        <div className="border border-border/50 rounded-xl overflow-hidden bg-background">
          <DataTable
            columns={[
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              { key: "role", label: "Role" },
              { key: "status", label: "Status" },
              { key: "action", label: "Actions" },
            ]}
            rows={rows}
          />
        </div>
      )}
    </DashboardCard>
  );
}
