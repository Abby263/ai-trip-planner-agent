"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DayRouteSelector } from "@/components/map/DayRouteSelector";
import { MapMarker } from "@/components/map/MapMarker";
import { RoutePolyline } from "@/components/map/RoutePolyline";
import type { MapData, MapMarker as Marker } from "@/types/trip";

declare global {
  interface Window {
    google?: any;
  }
}

export function TripMap({ mapData }: { mapData: MapData }) {
  const [selectedDay, setSelectedDay] = useState<number | "all">("all");
  const days = useMemo(
    () => Array.from(new Set(mapData.markers.map((marker) => marker.day).filter((day): day is number => typeof day === "number"))),
    [mapData.markers]
  );
  const visibleMarkers = mapData.markers.filter((marker) => selectedDay === "all" || marker.day === selectedDay || marker.day === null);

  return (
    <Card className="overflow-hidden border-border bg-white/95 dark:border-white/10 dark:bg-card/85">
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Route intelligence</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">Day clusters, route sequence, and booking-safe points.</p>
        </div>
        <Badge variant="secondary">{visibleMarkers.length} markers</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <DayRouteSelector days={days} selectedDay={selectedDay} onSelect={setSelectedDay} />
        <GoogleMapOrFallback center={mapData.center} markers={visibleMarkers} />
      </CardContent>
    </Card>
  );
}

function GoogleMapOrFallback({ center, markers }: { center: { lat: number; lng: number }; markers: Marker[] }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapRef = useRef<HTMLDivElement>(null);
  const [googleReady, setGoogleReady] = useState(false);

  useEffect(() => {
    if (!apiKey || !mapRef.current) return;
    loadGoogleMaps(apiKey).then(() => setGoogleReady(true)).catch(() => setGoogleReady(false));
  }, [apiKey]);

  useEffect(() => {
    if (!apiKey || !googleReady || !mapRef.current || !window.google) return;
    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 12,
      disableDefaultUI: true,
      clickableIcons: false,
      styles: [
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        { featureType: "transit", stylers: [{ visibility: "simplified" }] }
      ]
    });
    markers.forEach((marker) => {
      new window.google.maps.Marker({
        position: { lat: marker.lat, lng: marker.lng },
        map,
        title: marker.title,
        label: marker.label
      });
    });
  }, [apiKey, center, googleReady, markers]);

  if (apiKey) {
    return <div ref={mapRef} className="h-[420px] rounded-lg border bg-muted" />;
  }

  return <FallbackMap markers={markers} />;
}

function FallbackMap({ markers }: { markers: Marker[] }) {
  const [activeId, setActiveId] = useState<string | null>(markers[0]?.id ?? null);
  const bounds = useMemo(() => {
    if (markers.length === 0) {
      return { minLat: 0, maxLat: 1, minLng: 0, maxLng: 1 };
    }
    const lats = markers.map((marker) => marker.lat);
    const lngs = markers.map((marker) => marker.lng);
    return {
      minLat: Math.min(...lats) - 0.01,
      maxLat: Math.max(...lats) + 0.01,
      minLng: Math.min(...lngs) - 0.01,
      maxLng: Math.max(...lngs) + 0.01
    };
  }, [markers]);
  const positioned = markers.map((marker) => {
    const x = ((marker.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng || 1)) * 100;
    const y = (1 - (marker.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat || 1)) * 100;
    return { ...marker, x: Number.isFinite(x) ? x : 50, y: Number.isFinite(y) ? y : 50 };
  });
  const routePoints = positioned.filter((marker) => marker.type !== "hotel");

  if (markers.length === 0) {
    return (
      <div className="map-grid flex h-[420px] items-center justify-center rounded-lg border border-border bg-muted/35 text-sm text-muted-foreground dark:border-white/10">
        No map markers yet
      </div>
    );
  }

  return (
    <div className="relative h-[440px] overflow-hidden rounded-lg border border-border bg-[#dce8dd] dark:border-white/10 dark:bg-[#07111f]">
      <div className="map-grid absolute inset-0 bg-white/20 dark:bg-muted/20" />
      <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,211,77,0.35),transparent)] dark:bg-[linear-gradient(180deg,rgba(20,184,166,0.18),transparent)]" />
      <RoutePolyline points={routePoints} />
      {positioned.map((marker) => (
        <MapMarker
          key={marker.id}
          marker={marker}
          active={activeId === marker.id}
          onClick={() => setActiveId(marker.id)}
          style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
        />
      ))}
      <div className="absolute bottom-3 left-3 right-3 rounded-lg border border-border bg-white/92 p-3 text-sm shadow-lg backdrop-blur dark:border-white/10 dark:bg-background/90">
        <p className="font-medium">{positioned.find((marker) => marker.id === activeId)?.title ?? "Select a marker"}</p>
        <p className="mt-1 text-xs text-muted-foreground">Click route markers to inspect each stop.</p>
      </div>
    </div>
  );
}

function loadGoogleMaps(apiKey: string) {
  if (window.google?.maps) return Promise.resolve();
  const existing = document.querySelector<HTMLScriptElement>("script[data-google-maps]");
  if (existing) {
    return new Promise<void>((resolve, reject) => {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Google Maps failed to load")));
    });
  }
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.dataset.googleMaps = "true";
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () => reject(new Error("Google Maps failed to load")));
    document.head.appendChild(script);
  });
}
