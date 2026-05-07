"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Clock3, Database, MapPinned, MessageCircle, ShieldCheck, Sparkles, WalletCards } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { AgentProgressTimeline } from "@/components/trip/AgentProgressTimeline";
import { BookingLinksPanel } from "@/components/trip/BookingLinksPanel";
import { BudgetBreakdown } from "@/components/trip/BudgetBreakdown";
import { ItineraryOptionTabs } from "@/components/trip/ItineraryOptionTabs";
import { RefinePlanInput } from "@/components/trip/RefinePlanInput";
import { TripSearchForm } from "@/components/trip/TripSearchForm";
import { TripMap } from "@/components/map/TripMap";
import { Badge } from "@/components/ui/badge";
import { usePlanTrip } from "@/hooks/useTripPlan";
import { useTripStream } from "@/hooks/useTripStream";
import { usePlannerStore } from "@/stores/plannerStore";

export function PlannerExperience() {
  const mutation = usePlanTrip();
  const result = usePlannerStore((state) => state.result);
  const tripId = usePlannerStore((state) => state.tripId);
  const progress = usePlannerStore((state) => state.progress);
  const selectedOption = usePlannerStore((state) => state.selectedOption());
  const setProgress = usePlannerStore((state) => state.setProgress);
  useTripStream(tripId);

  return (
    <main className="fine-grid grid min-h-[calc(100vh-4rem)] gap-0 bg-[#f7f3ea] xl:grid-cols-[420px_1fr_460px] dark:bg-background">
      <aside className="border-r border-border/80 bg-white/78 p-4 backdrop-blur xl:h-[calc(100vh-4rem)] xl:overflow-y-auto dark:border-white/10 dark:bg-background/72">
        <div className="mb-4 rounded-lg border border-border bg-[#f6b800] p-5 text-black shadow-[0_18px_50px_rgba(15,23,42,0.1)]">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <p className="font-mono text-xs font-bold uppercase tracking-wide">Trip command</p>
          </div>
          <h1 className="mt-4 text-2xl font-black leading-tight">Ask for a trip, weekend, event plan, or refinement.</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            The agent will parse constraints, call mock providers, route days, estimate cost, validate, and return booking-safe options.
          </p>
        </div>
        <TripSearchForm
          loading={mutation.isPending}
          onSubmit={(payload) => {
            setProgress([]);
            mutation.mutate(payload);
          }}
        />
      </aside>
      <section className="space-y-5 p-4 xl:h-[calc(100vh-4rem)] xl:overflow-y-auto">
        <div className="rounded-lg border border-border bg-white/92 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur dark:border-white/10 dark:bg-card/80">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  Agent workspace
                </Badge>
                {result ? <Badge variant="muted">{result.options.length} options generated</Badge> : null}
              </div>
              <h2 className="mt-3 text-3xl font-black leading-tight">{result?.summary.title ?? "Trip planning workspace"}</h2>
              <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
                {result
                  ? "Compare route-aware options with source freshness, estimates, validation notes, and external booking links."
                  : "Generate the sample trip to see the complete provider-backed planning flow."}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:w-[440px]">
              {[
                { icon: Database, label: "Sources", value: result?.sources.length ?? 0 },
                { icon: MapPinned, label: "Markers", value: result?.map_data.markers.length ?? 0 },
                { icon: WalletCards, label: "Budget", value: selectedOption?.budget_summary ? "Ready" : "Pending" },
                { icon: ShieldCheck, label: "Validation", value: result ? "Passed" : "Idle" }
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-border bg-[#f7f3ea] p-3 dark:border-white/10 dark:bg-background/55">
                  <item.icon className="mb-2 h-4 w-4 text-primary" />
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="mt-1 text-sm font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <AgentProgressTimeline events={progress} running={mutation.isPending} />
        {mutation.error ? <ErrorState message={mutation.error.message} /> : null}
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div key={result.trip_id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <div className="mb-5 rounded-lg border border-border bg-white/80 p-4 dark:border-white/10 dark:bg-muted/20">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock3 className="h-4 w-4 text-secondary" />
                  {result.summary.assumptions.join(" ")}
                </div>
              </div>
              <ItineraryOptionTabs options={result.options} />
            </motion.div>
          ) : (
            <EmptyState
              title="No itinerary generated"
              description="Submit the Toronto to Delhi prompt to see mock flights, hotels, restaurants, events, route markers, budget, warnings, and sources."
            />
          )}
        </AnimatePresence>
      </section>
      <aside className="space-y-5 border-l border-border/80 bg-white/78 p-4 backdrop-blur xl:h-[calc(100vh-4rem)] xl:overflow-y-auto dark:border-white/10 dark:bg-background/72">
        {result ? <TripMap mapData={result.map_data} /> : <EmptyState title="Map is ready" description="Route markers appear when the agent returns a plan." />}
        {selectedOption?.budget_summary ? <BudgetBreakdown budget={selectedOption.budget_summary} /> : null}
        {result ? <BookingLinksPanel links={result.booking_links} /> : null}
        {result ? <RefinePlanInput tripId={result.trip_id} /> : null}
      </aside>
    </main>
  );
}
