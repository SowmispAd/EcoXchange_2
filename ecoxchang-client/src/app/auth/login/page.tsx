import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function AuthLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">
          Loading…
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  );
}
