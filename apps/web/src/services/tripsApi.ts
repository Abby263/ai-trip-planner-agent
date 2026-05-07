import { apiClient } from "@/services/apiClient";
import type { PlanTripRequest, PlanTripResponse, ProgressEvent } from "@/types/trip";

export function planTrip(payload: PlanTripRequest) {
  return apiClient<PlanTripResponse>("/api/trips/plan", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getTrip(tripId: string) {
  return apiClient<{ trip_id: string; status: string; result: PlanTripResponse["result"]; progress_events: ProgressEvent[] }>(
    `/api/trips/${tripId}`
  );
}

export function refineTrip(tripId: string, instruction: string, selectedOptionId?: string) {
  return apiClient<PlanTripResponse>(`/api/trips/${tripId}/refine`, {
    method: "POST",
    body: JSON.stringify({ instruction, selected_option_id: selectedOptionId })
  });
}
