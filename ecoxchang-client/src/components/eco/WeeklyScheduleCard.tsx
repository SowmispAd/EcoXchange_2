"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function WeeklyScheduleCard() {
  const currentDay = new Date().toLocaleDateString("en-US", { weekday: "long" });

  const { data: scheduleData, isLoading } = useQuery({
    queryKey: ["weekly-schedule"],
    queryFn: async () => {
      const res = await api.get("/schedule");
      return res.data.data;
    },
  });

  const weeklySchedule = scheduleData || [];

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Collection schedule
        </CardTitle>
        <CardDescription>Today is {currentDay}.</CardDescription>
      </CardHeader>
      <CardContent className="divide-y rounded-xl border">
        {isLoading ? (
          <div className="p-4 text-center text-sm text-muted-foreground animate-pulse">
            Loading schedule...
          </div>
        ) : weeklySchedule.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No schedule available.
          </div>
        ) : (
          weeklySchedule.map((item: { day: string; waste: string }) => (
            <div
              key={item.day}
              className={`flex items-center justify-between p-4 ${item.day === currentDay ? "bg-primary/5" : ""}`}
            >
              <div>
                <p className={`text-sm font-bold ${item.day === currentDay ? "text-primary" : "text-muted-foreground"}`}>
                  {item.day}
                </p>
                <p className="font-medium">{item.waste}</p>
              </div>
              {item.day === currentDay && (
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  Today
                </Badge>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
