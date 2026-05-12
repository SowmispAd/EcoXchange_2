"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function RewardCard({
  title,
  description,
  costPoints,
  eligible,
  onRedeem,
}: {
  title: string;
  description: string;
  costPoints: number;
  eligible: boolean;
  onRedeem?: () => void;
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between gap-2">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant={eligible ? "default" : "secondary"}>{costPoints} pts</Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <Button className="w-full" disabled={!eligible} onClick={onRedeem}>
          {eligible ? "Redeem" : "Not enough points"}
        </Button>
      </CardContent>
    </Card>
  );
}
