"use client";

import { CameraCapture } from "@/components/eco/CameraCapture";
import { DashboardCard } from "@/components/eco/DashboardCard";

export default function DeliveryProofsPage() {
  return (
    <DashboardCard title="Proof uploads" description="Attach geotagged photos for pickups and drop-offs.">
      <CameraCapture label="Proof of service" />
    </DashboardCard>
  );
}
