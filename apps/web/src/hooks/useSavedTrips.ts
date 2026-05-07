"use client";

import { useEffect, useState } from "react";

import type { FinalTripResponse } from "@/types/trip";

export function useSavedTrips() {
  const [trips, setTrips] = useState<FinalTripResponse[]>([]);

  useEffect(() => {
    setTrips(JSON.parse(localStorage.getItem("saved_trips") ?? "[]"));
  }, []);

  return { trips };
}
