"use client";

import { useEffect } from "react";

import { API_BASE_URL } from "@/services/apiClient";
import { usePlannerStore } from "@/stores/plannerStore";
import type { ProgressEvent } from "@/types/trip";

export function useTripStream(tripId: string | null) {
  const appendProgress = usePlannerStore((state) => state.appendProgress);

  useEffect(() => {
    if (!tripId) return;
    const source = new EventSource(`${API_BASE_URL}/api/trips/${tripId}/stream`);
    const events = [
      "intent_parsed",
      "missing_info_checked",
      "researching",
      "searching_flights",
      "searching_hotels",
      "searching_places",
      "searching_events",
      "optimizing_route",
      "building_itinerary",
      "estimating_budget",
      "validating",
      "repairing",
      "completed",
      "failed"
    ];
    events.forEach((eventName) => {
      source.addEventListener(eventName, (event) => {
        appendProgress(JSON.parse((event as MessageEvent).data) as ProgressEvent);
      });
    });
    return () => source.close();
  }, [appendProgress, tripId]);
}
