"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore, type AppRole, defaultHomeForRole } from "@/store/useAuthStore";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { mapApiUserToStore } from "@/lib/map-api-user";
import { toAppRole } from "@/lib/role-map";

interface AuthPageProps {
  role: AppRole;
  type: "login" | "register";
}

const roleBranding: Record<
  AppRole,
  { title: string; theme: string; iconColor: string }
> = {
  trial: { title: "Trial Member", theme: "from-amber-400 to-orange-500", iconColor: "text-orange-500" },
  member: {
    title: "Permanent Member",
    theme: "from-emerald-400 to-teal-600",
    iconColor: "text-emerald-500",
  },
  supervisor: { title: "Supervisor", theme: "from-blue-500 to-indigo-600", iconColor: "text-blue-500" },
  delivery: { title: "Delivery Agent", theme: "from-purple-500 to-pink-600", iconColor: "text-purple-500" },
  recycler: { title: "Recycler Partner", theme: "from-cyan-500 to-blue-600", iconColor: "text-cyan-500" },
  admin: { title: "Administrator", theme: "from-gray-700 to-slate-900", iconColor: "text-slate-800" },
};

export default function AuthPage({ role, type }: AuthPageProps) {
  const router = useRouter();
  const { setSession } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const brand = roleBranding[role];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === "register") {
        const res = await api.post("/auth/register", {
          name,
          email,
          password,
          role,
        });
        if (res.data?.success) {
          const { token, data: user, modelName } = res.data;
          setSession({ token, user: mapApiUserToStore(user), backendModel: modelName });
          toast.success("Account created successfully");
          router.push(defaultHomeForRole(toAppRole(String(user.role || role))));
        }
      } else {
        const res = await api.post("/auth/login", {
          email,
          password,
        });
        if (res.data?.success) {
          const { token, data: user, modelName } = res.data;
          setSession({ token, user: mapApiUserToStore(user), backendModel: modelName });
          toast.success("Logged in successfully");
          router.push(defaultHomeForRole(toAppRole(String(user.role || role))));
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${brand.theme} opacity-5 z-0`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent z-0" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <Link
          href="/roles"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to roles
        </Link>

        <Card className="border-none shadow-2xl bg-background/80 backdrop-blur-xl overflow-hidden">
          <div className={`h-1.5 w-full bg-gradient-to-r ${brand.theme}`} />
          <CardHeader className="space-y-1 text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-3 rounded-2xl">
                <Leaf className={`h-8 w-8 ${brand.iconColor}`} />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">{brand.title}</CardTitle>
            <CardDescription className="text-base">
              {type === "login"
                ? "Sign in to your account"
                : "Join EcoXchange today and make a difference"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {type === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    required
                    className="h-12"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {type === "login" && (
                    <Link href="/auth/forgot-account" className="text-sm font-medium text-primary hover:underline">
                      Forgot?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pr-12"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className={`w-full mt-4 h-12 text-lg font-bold shadow-lg bg-gradient-to-r ${brand.theme} border-none hover:opacity-90 transition-opacity`}
              >
                {loading ? "Processing..." : type === "login" ? "Sign In" : "Create Account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t p-8 bg-muted/10">
            <div className="text-sm text-center text-muted-foreground">
              Prefer Phone/OTP?{" "}
              <Link href={`/auth/verify-otp?role=${role}`} className="font-bold text-primary hover:underline">
                Use Phone Login
              </Link>
            </div>
            <div className="text-sm text-center text-muted-foreground">
              {type === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <Link href={`/auth/${role}-register`} className="font-bold text-primary hover:underline">
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link href={`/auth/${role}-login`} className="font-bold text-primary hover:underline">
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
