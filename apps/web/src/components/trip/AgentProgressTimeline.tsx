import { CheckCircle2, CircleDashed } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProgressEvent } from "@/types/trip";

const fallbackSteps = [
  "Understanding request",
  "Searching flights",
  "Comparing hotels",
  "Finding attractions",
  "Optimizing route",
  "Building itinerary",
  "Estimating budget",
  "Validating plan"
];

export function AgentProgressTimeline({ events, running }: { events: ProgressEvent[]; running?: boolean }) {
  const items = events.length > 0 ? events.map((event) => event.label) : fallbackSteps;
  return (
    <Card className="border-border bg-white/95 dark:border-white/10 dark:bg-card/80">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Agent progress</CardTitle>
        <span className="rounded-md border border-border px-2 py-1 font-mono text-xs text-muted-foreground dark:border-white/10">
          {events.length || 0}/{fallbackSteps.length}
        </span>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((label, index) => {
          const complete = events.length > 0 || (!running && index < 2);
          return (
            <div key={`${label}-${index}`} className="flex items-center gap-3 rounded-lg border border-border bg-[#f7f3ea] px-3 py-2 text-sm dark:border-white/10 dark:bg-background/45">
              {complete ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <CircleDashed className="h-4 w-4 animate-spin text-secondary" />}
              <span className={complete ? "text-foreground" : "text-muted-foreground"}>{label}</span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
