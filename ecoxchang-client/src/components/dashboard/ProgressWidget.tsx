import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ProgressWidgetProps {
  title: string;
  description?: string;
  value: number;
  max: number;
  icon?: LucideIcon;
  color?: string;
  className?: string;
}

export function ProgressWidget({ title, description, value, max, icon: Icon, color = "bg-primary", className }: ProgressWidgetProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-bold">{value}</span>
          <span className="text-sm text-muted-foreground">/ {max}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all duration-500 ease-out", color)} 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
