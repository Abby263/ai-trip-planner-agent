import { CalendarDays } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SourceBadge } from "@/components/trip/SourceBadge";
import { compactDateTime, formatMoney } from "@/lib/utils";
import type { EventOption } from "@/types/event";

export function EventCard({ event }: { event: EventOption }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarDays className="h-4 w-4 text-primary" />
          {event.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>{event.venue_name} · {compactDateTime(event.start_time)}</p>
        <p>{event.price_min ? formatMoney(event.price_min, event.currency) : "Estimated price unavailable"}</p>
        <p>{event.why_recommended}</p>
        <SourceBadge provider={event.provider} />
      </CardContent>
    </Card>
  );
}
