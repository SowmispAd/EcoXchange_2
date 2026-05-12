"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

const weeklySchedule = [
  { day: "Monday", waste: "Wet Waste" },
  { day: "Tuesday", waste: "Plastic Waste" },
  { day: "Wednesday", waste: "Paper Waste" },
  { day: "Thursday", waste: "Metal Waste" },
  { day: "Friday", waste: "E-Waste" },
  { day: "Saturday", waste: "Mixed Recycling" },
  { day: "Sunday", waste: "Awareness Day" },
];

export function WeeklyScheduleCard() {
  const currentDay = new Date().toLocaleDateString("en-US", { weekday: "long" });

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
        {weeklySchedule.map((item) => (
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
        ))}
      </CardContent>
    </Card>
  );
}
