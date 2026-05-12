import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  time: string;
  status: 'completed' | 'in-progress' | 'pending';
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={item.id} className="relative flex gap-4">
            {!isLast && (
              <div 
                className={cn(
                  "absolute left-[11px] top-8 bottom-[-16px] w-[2px]",
                  item.status === 'completed' ? "bg-primary" : "bg-muted"
                )} 
              />
            )}
            
            <div className="relative z-10 flex-shrink-0 mt-1">
              {item.status === 'completed' && <CheckCircle2 className="h-6 w-6 text-primary bg-background rounded-full" />}
              {item.status === 'in-progress' && <Clock className="h-6 w-6 text-amber-500 bg-background rounded-full" />}
              {item.status === 'pending' && <Circle className="h-6 w-6 text-muted-foreground bg-background rounded-full" />}
            </div>
            
            <div className="flex flex-col pb-4">
              <span className="text-sm font-medium">{item.title}</span>
              {item.description && (
                <span className="text-xs text-muted-foreground mt-0.5">{item.description}</span>
              )}
              <span className="text-xs font-semibold text-primary/80 mt-1">{item.time}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
