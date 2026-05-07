"use client";

import { useParams } from "next/navigation";

import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { BookingLinksPanel } from "@/components/trip/BookingLinksPanel";
import { BudgetBreakdown } from "@/components/trip/BudgetBreakdown";
import { ItineraryOptionTabs } from "@/components/trip/ItineraryOptionTabs";
import { RefinePlanInput } from "@/components/trip/RefinePlanInput";
import { TripMap } from "@/components/map/TripMap";
import { useTrip } from "@/hooks/useTripPlan";

export default function TripDetailPage() {
  const params = useParams<{ tripId: string }>();
  const { data, isLoading, error } = useTrip(params.tripId);

  if (isLoading) return <main className="container py-8"><LoadingState label="Loading trip" /></main>;
  if (error || !data?.result) return <main className="container py-8"><ErrorState message="Trip could not be loaded." /></main>;

  const result = data.result;
  const selected = result.options[1] ?? result.options[0];

  return (
    <main className="container grid gap-6 py-8 xl:grid-cols-[1fr_420px]">
      <section className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold">{result.summary.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{result.summary.assumptions.join(" ")}</p>
        </div>
        <ItineraryOptionTabs options={result.options} />
      </section>
      <aside className="space-y-5">
        <TripMap mapData={result.map_data} />
        {selected?.budget_summary ? <BudgetBreakdown budget={selected.budget_summary} /> : null}
        <BookingLinksPanel links={result.booking_links} />
        <RefinePlanInput tripId={result.trip_id} />
      </aside>
    </main>
  );
}
