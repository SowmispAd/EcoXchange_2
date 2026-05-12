"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export type TimelineStep = { id: string; label: string; at?: string; done: boolean };

export function TimelineTracker({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="space-y-0">
      {steps.map((s, idx) => (
        <li key={s.id} className="relative flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-background",
                s.done ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30",
              )}
            >
              {s.done ? <Check className="h-4 w-4" /> : <span className="text-xs text-muted-foreground">{idx + 1}</span>}
            </div>
            {idx < steps.length - 1 && (
              <div className="w-0.5 flex-1 min-h-[28px] bg-border" aria-hidden />
            )}
          </div>
          <div className={cn("pb-8", idx === steps.length - 1 && "pb-0")}>
            <p className={cn("font-semibold leading-none", !s.done && "text-muted-foreground")}>{s.label}</p>
            {s.at && <p className="text-xs text-muted-foreground mt-1">{s.at}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
