"use client";

import Link from "next/link";

import { EmptyState } from "@/components/common/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSavedTrips } from "@/hooks/useSavedTrips";

export default function TripsPage() {
  const { trips } = useSavedTrips();

  return (
    <main className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Saved trips</h1>
        <p className="mt-1 text-sm text-muted-foreground">Trip sessions stored locally by this demo frontend.</p>
      </div>
      {trips.length === 0 ? (
        <EmptyState title="No saved trips yet" description="Generate a trip plan from the planner and it will appear here." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {trips.map((trip) => (
            <Link key={trip.trip_id} href={`/trips/${trip.trip_id}`}>
              <Card className="transition-colors hover:border-primary">
                <CardHeader>
                  <CardTitle>{trip.summary.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {trip.summary.origin} to {trip.summary.destination} · {trip.options.length} options
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
