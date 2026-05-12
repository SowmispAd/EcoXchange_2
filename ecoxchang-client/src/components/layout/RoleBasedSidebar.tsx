"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { LogOut, Leaf } from "lucide-react";
import { NAV_BY_ROLE, type AppRole } from "@/config/role-nav";

interface RoleBasedSidebarProps {
  className?: string;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
}

export function RoleBasedSidebar({
  className,
  mobileMenuOpen,
  setMobileMenuOpen,
}: RoleBasedSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const role = (user?.role ?? "member") as AppRole;
  const links = NAV_BY_ROLE[role] ?? NAV_BY_ROLE.member;

  return (
    <div className={cn("pb-12 border-r bg-card h-screen flex flex-col", className)}>
      <div className="space-y-4 py-4 flex-1">
        <div className="px-3 py-2">
          <Link href="/" className="flex items-center space-x-2 pl-2 mb-10">
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">EcoXchange</span>
          </Link>

          <div className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen?.(false)}
                >
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start font-medium mb-1",
                      isActive
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {link.name}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-3 py-4 mt-auto border-t">
        <div className="flex items-center space-x-3 px-3 py-2 mb-4 bg-muted/50 rounded-lg">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden flex-shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-primary font-bold">{user?.name?.charAt(0) || "U"}</span>
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.name || "Guest"}</p>
            <p className="text-xs text-muted-foreground truncate capitalize">
              {user?.role?.replace("-", " ") || "user"}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={logout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Log out
        </Button>
      </div>
    </div>
  );
}

export { RoleBasedSidebar as Sidebar };
