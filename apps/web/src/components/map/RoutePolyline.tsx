import type { MapMarker } from "@/types/trip";

export function RoutePolyline({ points }: { points: Array<MapMarker & { x: number; y: number }> }) {
  if (points.length < 2) return null;
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        points={points.map((point) => `${point.x},${point.y}`).join(" ")}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="8 8"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
