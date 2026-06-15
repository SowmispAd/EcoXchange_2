"use client";

import { Bell, Check, Leaf } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface AppNotification {
  _id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  
  useEffect(() => {
    api.get("/api/notifications").then((res) => {
      if (res.data?.success) {
        setNotifications(res.data.data);
      }
    }).catch(console.error);
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "rounded-full relative shrink-0",
        )}
      >
        <Bell className="h-5 w-5 text-muted-foreground" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 min-w-[8px] h-2 px-0.5 bg-destructive rounded-full" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="py-4 text-center text-sm text-muted-foreground">No new notifications</div>
        ) : notifications.slice(0, 5).map((n) => (
          <DropdownMenuItem key={n._id} className="flex flex-col items-start gap-1 py-3 cursor-pointer" onClick={() => {
            if (!n.read) {
              api.patch(`/api/notifications/${n._id}/read`).then(() => {
                setNotifications(prev => prev.map(p => p._id === n._id ? { ...p, read: true } : p));
              });
            }
          }}>
            <div className="flex w-full gap-2">
              <div className="mt-0.5 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Leaf className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm leading-tight", n.read ? "font-normal text-muted-foreground" : "font-semibold")}>{n.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
              {n.read && <Check className="h-4 w-4 text-emerald-500 shrink-0" />}
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center text-primary justify-center">
          View all activity
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
