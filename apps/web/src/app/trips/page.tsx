"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Plane, Sparkles, Trash2 } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSavedTrips } from "@/hooks/useSavedTrips";
import { formatMoney } from "@/lib/utils";

export default function TripsPage() {
  const { trips, remove, clear, hydrated } = useSavedTrips();

  return (
    <main className="container py-10">
      <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Library</p>
          <h1 className="mt-2 text-3xl font-black md:text-4xl">Your saved trips</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Trip sessions are stored locally in this browser. Generate a plan from the planner and it appears here.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild>
            <Link href="/planner">
              <Sparkles className="h-4 w-4" />
              Plan a new trip
            </Link>
          </Button>
          {trips.length > 0 ? (
            <Button variant="outline" type="button" onClick={clear}>
              <Trash2 className="h-4 w-4" />
              Clear all
            </Button>
          ) : null}
        </div>
      </header>

      {!hydrated ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((skeleton) => (
            <div key={skeleton} className="h-44 animate-pulse rounded-lg border border-border bg-muted/40" />
          ))}
        </div>
      ) : trips.length === 0 ? (
        <EmptyState
          title="No saved trips yet"
          description="Generate a trip plan from the planner and it will appear here, along with all options, sources, budgets, and booking links."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {trips.map((trip) => {
            const selectedOption = trip.options[1] ?? trip.options[0];
            const total = selectedOption?.estimated_total ?? 0;
            const currency = selectedOption?.currency ?? trip.summary.currency;
            return (
              <Card
                key={trip.trip_id}
                className="group relative overflow-hidden border-border bg-card transition-shadow hover:shadow-lg"
              >
                <Link href={`/trips/${trip.trip_id}`} className="absolute inset-0 z-0" aria-label={`Open ${trip.summary.title}`} />
                <CardHeader className="relative">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{trip.options.length} options</Badge>
                    {trip.summary.duration_days ? <Badge variant="muted">{trip.summary.duration_days} days</Badge> : null}
                    {trip.summary.traveler_count > 1 ? (
                      <Badge variant="outline">{trip.summary.traveler_count} travelers</Badge>
                    ) : null}
                  </div>
                  <CardTitle className="text-lg">{trip.summary.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {trip.summary.origin ? (
                      <>
                        <Plane className="h-3.5 w-3.5" />
                        <span>
                          {trip.summary.origin}
                          {trip.summary.destination ? ` → ${trip.summary.destination}` : ""}
                        </span>
                      </>
                    ) : (
                      <>
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{trip.summary.destination ?? "Local plan"}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">From {formatMoney(total, currency)}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                      Open
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                  <div className="relative z-10 flex justify-end">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        remove(trip.trip_id);
                      }}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`Remove ${trip.summary.title}`}
                    >
                      <Trash2 className="h-3 w-3" />
                      Remove
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}
