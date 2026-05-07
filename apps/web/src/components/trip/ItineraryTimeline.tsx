import { ActivityCard } from "@/components/trip/ActivityCard";
import type { ItineraryDay } from "@/types/trip";

export function ItineraryTimeline({ days }: { days: ItineraryDay[] }) {
  return (
    <div className="space-y-5">
      {days.map((day) => (
        <section key={day.day_number} className="space-y-3">
          <div>
            <p className="font-mono text-xs text-secondary">Day {day.day_number}{day.date ? ` · ${day.date}` : ""}</p>
            <h3 className="text-lg font-semibold">{day.title}</h3>
            <p className="text-sm text-muted-foreground">{day.theme}</p>
          </div>
          <div className="space-y-3">
            {day.activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
