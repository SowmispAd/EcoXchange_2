"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/lib/api";
import { mapApiUserToStore } from "@/lib/map-api-user";

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
