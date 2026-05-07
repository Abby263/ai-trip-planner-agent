import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlightCard } from "@/components/trip/FlightCard";
import { HotelCard } from "@/components/trip/HotelCard";
import { ItineraryTimeline } from "@/components/trip/ItineraryTimeline";
import { formatMoney } from "@/lib/utils";
import type { ItineraryOption } from "@/types/trip";

export function ItineraryOptionCard({ option }: { option: ItineraryOption }) {
  const activityCount = option.days.reduce((count, day) => count + day.activities.length, 0);
  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-border bg-white/95 dark:border-white/10 dark:bg-card/85">
        <div className="h-1 bg-[linear-gradient(90deg,hsl(var(--primary)),hsl(var(--secondary)),hsl(var(--accent)))]" />
        <CardHeader className="flex-row items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex flex-wrap gap-2">
              <Badge variant="secondary">{option.pace}</Badge>
              <Badge variant="muted">{activityCount} stops</Badge>
              <Badge variant="outline">{option.confidence} confidence</Badge>
            </div>
            <CardTitle className="text-2xl">{option.name}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{option.best_for}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-semibold">{formatMoney(option.estimated_total, option.currency)}</p>
            <p className="mt-1 text-xs text-muted-foreground">Total estimate</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {option.highlights.map((highlight) => (
              <Badge key={highlight} variant="outline">{highlight}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        {option.flight ? <FlightCard flight={option.flight} /> : null}
        {option.hotel ? <HotelCard hotel={option.hotel} /> : null}
      </div>
      <ItineraryTimeline days={option.days} />
    </div>
  );
}
