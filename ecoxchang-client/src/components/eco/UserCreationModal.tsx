"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { api } from "@/lib/api";

interface UserCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultRole?: string;
  onSuccess?: () => void;
}

export function UserCreationModal({ open, onOpenChange, defaultRole, onSuccess }: UserCreationModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: defaultRole || "supervisor",
    area: "",
    zones: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string | null) => {
    if (value) {
      setFormData((prev) => ({ ...prev, role: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For Admin user creation, the backend might handle it via POST /admin/users or /admin/supervisors
      const endpoint = `/admin/users`;
      const res = await api.post(endpoint, formData);

      if (res.data?.success) {
        toast.success("User created successfully!");
        onOpenChange(false);
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>Add a new system user and assign their role and territory.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="Enter full name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="user@example.com" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Temporary Password</Label>
            <Input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" />
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="supervisor">Supervisor</SelectItem>
                <SelectItem value="delivery_agent">Delivery Agent</SelectItem>
                <SelectItem value="recycler">Recycler</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(formData.role === "supervisor" || formData.role === "delivery_agent") && (
            <div className="space-y-2">
              <Label htmlFor="area">Assigned Area</Label>
              <Input id="area" name="area" value={formData.area} onChange={handleChange} placeholder="e.g. North Zone" />
            </div>
          )}

          {formData.role === "recycler" && (
            <div className="space-y-2">
              <Label htmlFor="zones">Operating Zones (comma separated)</Label>
              <Input id="zones" name="zones" value={formData.zones} onChange={handleChange} placeholder="Zone A, Zone B" />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
