"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const dot = L.divIcon({
  className: "eco-leaflet-dot",
  html: '<div style="width:14px;height:14px;border-radius:9999px;background:oklch(0.55 0.15 150);border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.25)"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

export default function RouteMapInner({
  center,
  points,
}: {
  center: [number, number];
  points?: [number, number][];
}) {
  const line: [number, number][] =
    points && points.length > 1
      ? points.map(([lat, lng]) => [lat, lng] as [number, number])
      : [
          center,
          [center[0] + 0.02, center[1] + 0.02],
          [center[0] - 0.015, center[1] + 0.03],
        ];

  return (
    <div className="h-[320px] w-full overflow-hidden rounded-lg z-0 [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full">
      <MapContainer center={center} zoom={13} className="h-full w-full" scrollWheelZoom={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
        {line.map((pos, i) => (
          <Marker key={i} position={pos} icon={dot}>
            <Popup>Stop {i + 1}</Popup>
          </Marker>
        ))}
        <Polyline positions={line} pathOptions={{ color: "var(--primary)", weight: 4 }} />
      </MapContainer>
    </div>
  );
}
