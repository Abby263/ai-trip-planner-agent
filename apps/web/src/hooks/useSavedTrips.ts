"use client";

import { useCallback, useEffect, useState } from "react";

import type { FinalTripResponse } from "@/types/trip";

const STORAGE_KEY = "saved_trips";

export function useSavedTrips() {
  const [trips, setTrips] = useState<FinalTripResponse[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setTrips(raw ? (JSON.parse(raw) as FinalTripResponse[]) : []);
    } catch {
      setTrips([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  const remove = useCallback((tripId: string) => {
    setTrips((prev) => {
      const next = prev.filter((trip) => trip.trip_id !== tripId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setTrips([]);
  }, []);

  return { trips, remove, clear, hydrated };
}
