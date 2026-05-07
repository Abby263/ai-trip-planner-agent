import { Plane } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriceFreshnessBadge } from "@/components/trip/PriceFreshnessBadge";
import { SourceBadge } from "@/components/trip/SourceBadge";
import { formatMoney } from "@/lib/utils";
import type { FlightOption } from "@/types/flight";

export function FlightCard({ flight }: { flight: FlightOption }) {
  return (
    <Card className="border-border bg-white/95 dark:border-white/10 dark:bg-card/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Plane className="h-4 w-4 text-primary" />
          {flight.airline}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono">{flight.origin_airport} → {flight.destination_airport}</span>
          <span className="font-semibold">{formatMoney(flight.price, flight.currency)}</span>
        </div>
        <p className="text-muted-foreground">{Math.round(flight.duration_minutes / 60)}h · {flight.stops} stop · {flight.cabin_class}</p>
        <p className="text-muted-foreground">{flight.ranking_reason}</p>
        <div className="flex flex-wrap gap-2">
          <SourceBadge provider={flight.provider} />
          <PriceFreshnessBadge fetchedAt={flight.fetched_at} confidence={flight.price_confidence} />
        </div>
      </CardContent>
    </Card>
  );
}
