"use client";

import { useState, useEffect } from "react";
import { RoleBasedSidebar } from "./RoleBasedSidebar";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthStore, defaultHomeForRole } from "@/store/useAuthStore";
import { useRouter, usePathname } from "next/navigation";
import { NotificationBell } from "@/components/eco/NotificationBell";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { getDashboardTitle, type AppRole } from "@/config/role-nav";
import { pathToAppRole } from "@/lib/path-role";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const role = user?.role as AppRole | undefined;
    const pathRole = pathToAppRole(pathname);

    if (role && pathRole && pathRole !== role) {
      router.replace(defaultHomeForRole(role));
    }
  }, [isAuthenticated, user, pathname, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="hidden md:flex h-screen w-64 flex-col fixed inset-y-0 z-50">
        <RoleBasedSidebar />
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-64 bg-background z-50 md:hidden"
            >
              <RoleBasedSidebar
                setMobileMenuOpen={setMobileMenuOpen}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="md:pl-64 flex flex-col flex-1 min-h-screen">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-4 sm:px-6 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex-1 flex items-center justify-between gap-4">
            <h1 className="text-xl font-semibold tracking-tight truncate">
              {title || getDashboardTitle(pathname)}
            </h1>

            <div className="flex items-center gap-2 sm:gap-3 ml-auto">
              <div className="relative hidden md:block">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-52 lg:w-64 rounded-full pl-9 bg-muted/50 border-none focus-visible:ring-1"
                />
              </div>
              <ThemeToggle />
              <NotificationBell />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}
