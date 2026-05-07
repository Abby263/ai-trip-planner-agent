"use client";

import { LocateFixed } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";

export function LocationPermissionButton({ onLocation }: { onLocation: (location: { lat: number; lng: number }) => void }) {
  const { location, error, loading, requestLocation } = useCurrentLocation();

  useEffect(() => {
    if (location) onLocation(location);
  }, [location, onLocation]);

  return (
    <div className="space-y-2">
      <Button type="button" variant="outline" onClick={requestLocation} disabled={loading} className="w-full">
        <LocateFixed className="h-4 w-4" />
        {loading ? "Checking location" : "Use current location"}
      </Button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
