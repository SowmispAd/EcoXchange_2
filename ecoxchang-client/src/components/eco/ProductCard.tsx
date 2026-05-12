"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ProductCard({
  name,
  category,
  price,
  image,
  seller,
  score,
  onBuy,
  sellDisabled,
  sellTooltip,
}: {
  name: string;
  category: string;
  price: number;
  image: string;
  seller: string;
  score: number;
  onBuy?: () => void;
  sellDisabled?: boolean;
  sellTooltip?: string;
}) {
  return (
    <Card className="overflow-hidden flex flex-col">
      <CardHeader className="pb-2">
        <div className="text-4xl mb-2" aria-hidden>
          {image}
        </div>
        <CardTitle className="text-base leading-snug">{name}</CardTitle>
        <div className="flex flex-wrap gap-2 pt-1">
          <Badge variant="secondary">{category}</Badge>
          <Badge variant="outline">Score {score}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 text-sm text-muted-foreground">Seller: {seller}</CardContent>
      <CardFooter className="flex flex-wrap gap-2 justify-between border-t bg-muted/30">
        <p className="text-lg font-bold">₹{price}</p>
        <div className="flex gap-2">
          <Button size="sm" onClick={onBuy}>
            Buy
          </Button>
          <span title={sellTooltip}>
            <Button size="sm" variant="outline" disabled={sellDisabled}>
              Sell
            </Button>
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
