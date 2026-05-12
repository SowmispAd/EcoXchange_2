"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Leaf, ShoppingBag } from 'lucide-react';

export function MemberStats() {
  return (
    <Card className="bg-gradient-to-br from-primary to-emerald-600 text-primary-foreground border-none shadow-md overflow-hidden">
      <CardContent className="p-6 flex flex-col justify-between h-full relative">
        <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
          <Leaf className="h-32 w-32" />
        </div>
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <p className="text-sm font-medium opacity-80 mb-1">EcoPoints Balance</p>
            <h3 className="text-4xl font-extrabold tracking-tight">2,450 <span className="text-xl font-medium opacity-80">pts</span></h3>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-none px-3 py-1 text-sm font-semibold">
            Gold Tier Member
          </Badge>
        </div>
        <div className="relative z-10 mt-6 pt-4 border-t border-white/20 flex flex-wrap gap-4">
          <Button size="sm" variant="secondary" className="bg-white text-primary hover:bg-white/90 font-bold">
            <ShoppingBag className="mr-2 h-4 w-4" /> Redeem Points
          </Button>
          <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-bold">
            View Impact History
          </Button>
          <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 font-bold ml-auto">
            Upgrade Membership
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
