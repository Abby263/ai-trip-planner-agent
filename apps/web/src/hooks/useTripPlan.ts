"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import { getTrip, planTrip, refineTrip } from "@/services/tripsApi";
import { usePlannerStore } from "@/stores/plannerStore";
import type { PlanTripRequest } from "@/types/trip";

export function usePlanTrip() {
  const setResult = usePlannerStore((state) => state.setResult);
  return useMutation({
    mutationFn: (payload: PlanTripRequest) => planTrip(payload),
    onSuccess: (response) => {
      if (response.result && "options" in response.result) {
        setResult(response.trip_id, response.result);
        const saved = JSON.parse(localStorage.getItem("saved_trips") ?? "[]");
        localStorage.setItem("saved_trips", JSON.stringify([response.result, ...saved.filter((trip: { trip_id: string }) => trip.trip_id !== response.trip_id)]));
      }
    }
  });
}

export function useTrip(tripId: string) {
  return useQuery({
    queryKey: ["trip", tripId],
    queryFn: () => getTrip(tripId),
    enabled: Boolean(tripId)
  });
}

export function useRefineTrip() {
  const setResult = usePlannerStore((state) => state.setResult);
  return useMutation({
    mutationFn: ({ tripId, instruction, selectedOptionId }: { tripId: string; instruction: string; selectedOptionId?: string }) =>
      refineTrip(tripId, instruction, selectedOptionId),
    onSuccess: (response) => {
      if (response.result && "options" in response.result) setResult(response.trip_id, response.result);
    }
  });
}
