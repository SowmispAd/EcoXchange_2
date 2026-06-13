"use client";

import { useState, useEffect } from "react";
import { RouteMap } from "@/components/eco/RouteMap";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

interface MapTask {
  status: string;
  destinationLat?: number;
  destinationLng?: number;
}

export default function DeliveryMapPage() {
  const [points, setPoints] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRoute = () => {
    setLoading(true);
    api
      .get("/api/delivery/tasks")
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          const activeTasks = (res.data.data as MapTask[]).filter(
            (t) => t.status === "in_progress" || t.status === "accepted" || t.status === "assigned"
          );
          // Default start point (e.g. Bangalore center)
          const routePoints: [number, number][] = [[12.9716, 77.5946]];
          activeTasks.forEach((t) => {
            if (t.destinationLat && t.destinationLng) {
              routePoints.push([t.destinationLat, t.destinationLng]);
            }
          });
          setPoints(routePoints);
        }
      })
      .catch((err: unknown) => {
        const error = err as { response?: { data?: { message?: string } } };
        toast.error(error.response?.data?.message || "Failed to load route map tasks");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const t = setTimeout(() => {
      fetchRoute();
    }, 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Link href="/dashboard/delivery/dashboard">
          <Button variant="outline" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
        <Button variant="outline" size="sm" onClick={fetchRoute} className="gap-1" disabled={loading}>
          <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} /> Refresh Route
        </Button>
      </div>

      <div className="h-[600px] w-full relative border border-border rounded-lg overflow-hidden bg-muted">
        <RouteMap title="Today's Route" points={points.length > 1 ? points : undefined} />
      </div>
    </div>
  );
}
