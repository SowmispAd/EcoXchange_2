"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore, defaultHomeForRole } from "@/store/useAuthStore";
import toast from "react-hot-toast";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().optional(),
  address: z.string().min(5),
});

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user, updateUser, setIsNewUser } = useAuthStore();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", address: "" },
  });

  useEffect(() => {
    if (!user) router.replace("/auth/login");
  }, [user, router]);

  const onSubmit = form.handleSubmit((v) => {
    updateUser({
      name: v.name,
      email: v.email || undefined,
      address: v.address,
    });
    setIsNewUser(false);
    toast.success("Profile saved");
    const role = useAuthStore.getState().user?.role ?? "trial";
    router.push(defaultHomeForRole(role));
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-lg border-none shadow-xl">
        <CardHeader>
          <CardTitle>Complete your profile</CardTitle>
          <CardDescription>Secondary details after phone verification.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input id="email" type="email" {...form.register("email")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...form.register("address")} />
              {form.formState.errors.address && (
                <p className="text-xs text-destructive">{form.formState.errors.address.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full h-12">
              Save & go to dashboard
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
