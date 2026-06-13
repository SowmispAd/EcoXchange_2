"use client";

import { CameraCapture } from "@/components/eco/CameraCapture";
import { DashboardCard } from "@/components/eco/DashboardCard";

export default function DeliveryProofsPage() {
  return (
    <DashboardCard title="Proof uploads" description="Attach geotagged photos for pickups and drop-offs.">
      <div className="max-w-2xl mx-auto mt-4">
        <CameraCapture 
          onCapture={() => {
            console.log("Captured image for proof");
          }} 
        />
      </div>
    </DashboardCard>
  );
}
