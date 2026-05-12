"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const MapInner = dynamic(() => import("./RouteMapInner"), { ssr: false, loading: () => <MapSkeleton /> });

function MapSkeleton() {
  return <div className="h-[320px] w-full animate-pulse rounded-lg bg-muted" />;
}

export function RouteMap({ title = "Route map", points }: { title?: string; points?: [number, number][] }) {
  const center = useMemo<[number, number]>(() => [12.9716, 77.5946], []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Live routing preview (OpenStreetMap).</CardDescription>
      </CardHeader>
      <CardContent>
        <MapInner center={center} points={points} />
      </CardContent>
    </Card>
  );
}
