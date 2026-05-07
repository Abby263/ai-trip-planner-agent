import { Bed, Calendar, Landmark, Plane, Utensils } from "lucide-react";

import { cn } from "@/lib/utils";
import type { MapMarker as Marker } from "@/types/trip";

const icons = {
  airport: Plane,
  hotel: Bed,
  attraction: Landmark,
  restaurant: Utensils,
  event: Calendar
};

export function MapMarker({
  marker,
  style,
  active,
  onClick
}: {
  marker: Marker;
  style: React.CSSProperties;
  active?: boolean;
  onClick?: () => void;
}) {
  const Icon = icons[marker.type];
  return (
    <button
      type="button"
      title={marker.title}
      onClick={onClick}
      className={cn(
        "absolute z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border border-border bg-white/94 text-xs font-semibold shadow-premium backdrop-blur transition-transform hover:scale-110 dark:border-white/15 dark:bg-background/92",
        active && "bg-primary text-primary-foreground"
      )}
      style={style}
    >
      <Icon className="h-4 w-4" />
      <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-md bg-secondary px-1 font-mono text-[10px] text-secondary-foreground">
        {marker.label}
      </span>
    </button>
  );
}
