"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  subMonths,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CalendarView({
  events,
}: {
  events: { date: string; type: string }[];
}) {
  const [cursor, setCursor] = useState(new Date());
  const start = startOfMonth(cursor);
  const end = endOfMonth(cursor);
  const days = eachDayOfInterval({ start, end });
  const pad = start.getDay();
  const blanks = Array.from({ length: pad }, (_, i) => i);

  const byDay = useMemo(() => {
    const m = new Map<string, string>();
    events.forEach((e) => m.set(e.date, e.type));
    return m;
  }, [events]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={() => setCursor(subMonths(cursor, 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <p className="text-lg font-semibold">{format(cursor, "MMMM yyyy")}</p>
        <Button variant="outline" size="icon" onClick={() => setCursor(addMonths(cursor, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
        {blanks.map((b) => (
          <div key={`b-${b}`} />
        ))}
        {days.map((d) => {
          const key = format(d, "yyyy-MM-dd");
          const tag = byDay.get(key);
          const today = isSameDay(d, new Date());
          return (
            <div
              key={key}
              className={cn(
                "min-h-14 rounded-lg border p-1 flex flex-col items-center justify-start gap-1 text-sm",
                today && "border-primary bg-primary/5",
                !isSameMonth(d, cursor) && "opacity-40",
              )}
            >
              <span className="font-medium">{format(d, "d")}</span>
              {tag && (
                <span className="text-[10px] leading-tight px-1 py-0.5 rounded bg-secondary text-secondary-foreground">
                  {tag}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
