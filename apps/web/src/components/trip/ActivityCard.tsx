import { Clock, ExternalLink, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SourceBadge } from "@/components/trip/SourceBadge";
import { formatMoney } from "@/lib/utils";
import type { ItineraryActivity } from "@/types/trip";

export function ActivityCard({ activity }: { activity: ItineraryActivity }) {
  return (
    <div className="rounded-lg border border-border bg-white/92 p-4 shadow-[0_12px_35px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-card/72 dark:shadow-[0_12px_35px_rgba(0,0,0,0.12)]">
      <div className="flex flex-col justify-between gap-3 md:flex-row">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">{activity.start_time}–{activity.end_time}</span>
            <Badge variant="muted">{activity.category}</Badge>
            <SourceBadge provider={activity.source_provider} />
          </div>
          <h4 className="mt-2 font-semibold">{activity.title}</h4>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{activity.description}</p>
        </div>
        <div className="min-w-36 text-left text-sm md:text-right">
          <p className="font-semibold">{formatMoney(activity.estimated_cost, activity.currency)}</p>
          {activity.travel_time_from_previous_minutes ? (
            <p className="mt-1 text-muted-foreground">
              <Clock className="mr-1 inline h-3 w-3" />
              {activity.travel_time_from_previous_minutes} min
            </p>
          ) : null}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground dark:border-white/10">
        <span>
          <MapPin className="mr-1 inline h-3 w-3" />
          {activity.address}
        </span>
        {activity.booking_url ? (
          <Button asChild variant="outline" size="sm">
            <a href={activity.booking_url} target="_blank" rel="noreferrer">
              Open link
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
