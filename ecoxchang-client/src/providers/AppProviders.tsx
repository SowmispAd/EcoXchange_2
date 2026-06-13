"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster, toast } from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/lib/api";
import { mapApiUserToStore } from "@/lib/map-api-user";

import { socket } from "@/lib/socket";

function AuthInitializer() {
  const { token, setSession, logout } = useAuthStore();

  useEffect(() => {
    if (token) {
      api
        .get("/auth/me")
        .then((res) => {
          if (res.data?.success && res.data?.data) {
             const { user, modelName } = res.data.data;
             setSession({ token, user: mapApiUserToStore(user), backendModel: modelName });
          }
        })
        .catch(() => {
          logout();
        });
    }
  }, [token, setSession, logout]);

  // Socket.IO notification listener
  const user = useAuthStore((s) => s.user);
  useEffect(() => {
    if (!token || !user?.id) return;
    socket.connect();
    socket.emit("join", user.id);

    socket.on("notification", (data: { title: string; message: string }) => {
      toast.success(
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold">{data.title}</span>
          <span className="text-xs text-muted-foreground">{data.message}</span>
        </div>,
        { duration: 5000 }
      );
    });

    return () => {
      socket.off("notification");
      socket.disconnect();
    };
  }, [token, user?.id]);

  return null;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000, refetchOnWindowFocus: false },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <AuthInitializer />
        {children}
        <Toaster position="top-center" toastOptions={{ className: "text-sm" }} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
