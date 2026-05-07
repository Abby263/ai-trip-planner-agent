import { create } from "zustand";

import type { FinalTripResponse, ItineraryOption, ProgressEvent } from "@/types/trip";

interface PlannerState {
  tripId: string | null;
  result: FinalTripResponse | null;
  selectedOptionId: string | null;
  progress: ProgressEvent[];
  setResult: (tripId: string, result: FinalTripResponse) => void;
  setSelectedOptionId: (id: string) => void;
  setProgress: (progress: ProgressEvent[]) => void;
  appendProgress: (event: ProgressEvent) => void;
  selectedOption: () => ItineraryOption | null;
}

export const usePlannerStore = create<PlannerState>((set, get) => ({
  tripId: null,
  result: null,
  selectedOptionId: null,
  progress: [],
  setResult: (tripId, result) =>
    set({
      tripId,
      result,
      selectedOptionId: result.options[1]?.id ?? result.options[0]?.id ?? null
    }),
  setSelectedOptionId: (id) => set({ selectedOptionId: id }),
  setProgress: (progress) => set({ progress }),
  appendProgress: (event) => set((state) => ({ progress: [...state.progress, event] })),
  selectedOption: () => {
    const { result, selectedOptionId } = get();
    return result?.options.find((option) => option.id === selectedOptionId) ?? result?.options[0] ?? null;
  }
}));
