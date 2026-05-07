import { CheckCircle2, CircleDashed, CircleDot, XCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ProgressEvent } from "@/types/trip";

const PIPELINE: { key: string; label: string }[] = [
  { key: "intent_parsed", label: "Understanding request" },
  { key: "missing_info_checked", label: "Checking required details" },
  { key: "researching", label: "Planning research" },
  { key: "searching_flights", label: "Searching flights" },
  { key: "searching_hotels", label: "Comparing hotels" },
  { key: "searching_places", label: "Finding attractions" },
  { key: "searching_events", label: "Finding events" },
  { key: "optimizing_route", label: "Optimizing route" },
  { key: "building_itinerary", label: "Building itinerary" },
  { key: "estimating_budget", label: "Estimating budget" },
  { key: "validating", label: "Validating plan" },
  { key: "completed", label: "Plan ready" }
];

export function AgentProgressTimeline({ events, running }: { events: ProgressEvent[]; running?: boolean }) {
  const seen = new Map(events.map((event) => [event.event, event] as const));
  const failure = events.find((event) => event.status === "failed");
  const currentIndex = nextRunningIndex(seen, running);

  return (
    <Card className="border-border bg-white/95 dark:border-white/10 dark:bg-card/80">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Agent progress</CardTitle>
        <span className="rounded-md border border-border px-2 py-1 font-mono text-xs text-muted-foreground dark:border-white/10">
          {Math.min(events.length, PIPELINE.length)}/{PIPELINE.length}
        </span>
      </CardHeader>
      <CardContent>
        <ol className="grid gap-2 md:grid-cols-2">
          {PIPELINE.map((step, index) => {
            const event = seen.get(step.key);
            const isComplete = Boolean(event) && event?.status !== "failed";
            const isFailed = event?.status === "failed" || (failure && step.key === "completed");
            const isCurrent = !isComplete && !isFailed && index === currentIndex && running;
            return (
              <li
                key={step.key}
                className={cn(
                  "flex items-start gap-3 rounded-lg border border-border bg-[#f7f3ea] px-3 py-2 text-sm transition-colors dark:border-white/10 dark:bg-background/45",
                  isCurrent && "border-secondary/60 bg-secondary/10",
                  isFailed && "border-destructive/40 bg-destructive/10"
                )}
              >
                <span className="mt-0.5">
                  {isFailed ? (
                    <XCircle className="h-4 w-4 text-destructive" />
                  ) : isComplete ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : isCurrent ? (
                    <CircleDot className="h-4 w-4 animate-pulse text-secondary" />
                  ) : (
                    <CircleDashed className="h-4 w-4 text-muted-foreground/60" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "font-medium",
                      isComplete ? "text-foreground" : "text-muted-foreground",
                      isFailed && "text-destructive"
                    )}
                  >
                    {step.label}
                  </p>
                  {event?.detail ? (
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{event.detail}</p>
                  ) : null}
                </div>
                {event ? (
                  <span className="ml-2 shrink-0 font-mono text-[10px] text-muted-foreground">
                    {formatTime(event.timestamp)}
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}

function nextRunningIndex(seen: Map<string, ProgressEvent>, running?: boolean) {
  if (!running) return -1;
  for (let i = 0; i < PIPELINE.length; i += 1) {
    if (!seen.has(PIPELINE[i].key)) return i;
  }
  return -1;
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
