"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { KeyRound, Layers, MapPin, Maximize2, Minimize2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DayRouteSelector } from "@/components/map/DayRouteSelector";
import { MapMarker } from "@/components/map/MapMarker";
import { RoutePolyline } from "@/components/map/RoutePolyline";
import { cn } from "@/lib/utils";
import type { MapData, MapMarker as Marker } from "@/types/trip";

declare global {
  interface Window {
    google?: any;
  }
}

const MARKER_COLORS: Record<Marker["type"], string> = {
  hotel: "#0F766E",
  attraction: "#B45309",
  restaurant: "#BE123C",
  event: "#6D28D9",
  airport: "#1D4ED8"
};

const DAY_COLORS = ["#0F766E", "#B45309", "#1D4ED8", "#BE123C", "#6D28D9", "#047857", "#7C2D12"];

export function TripMap({ mapData }: { mapData: MapData }) {
  const [selectedDay, setSelectedDay] = useState<number | "all">("all");
  const [expanded, setExpanded] = useState(false);
  const days = useMemo(
    () =>
      Array.from(
        new Set(mapData.markers.map((marker) => marker.day).filter((day): day is number => typeof day === "number"))
      ).sort((a, b) => a - b),
    [mapData.markers]
  );
  const visibleMarkers = useMemo(
    () =>
      mapData.markers.filter(
        (marker) => selectedDay === "all" || marker.day === selectedDay || marker.day === null
      ),
    [mapData.markers, selectedDay]
  );

  return (
    <Card className="overflow-hidden border-border bg-white/95 dark:border-white/10 dark:bg-card/85">
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Route intelligence
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Map-first view with day routing, hotel anchor, and clickable stops.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{visibleMarkers.length} stops</Badge>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label={expanded ? "Collapse map" : "Expand map"}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <DayRouteSelector days={days} selectedDay={selectedDay} onSelect={setSelectedDay} />
        <GoogleMapOrFallback
          center={mapData.center}
          markers={visibleMarkers}
          selectedDay={selectedDay}
          height={expanded ? 640 : 420}
        />
        <MapLegend markers={visibleMarkers} />
      </CardContent>
    </Card>
  );
}

function GoogleMapOrFallback({
  center,
  markers,
  selectedDay,
  height
}: {
  center: { lat: number; lng: number };
  markers: Marker[];
  selectedDay: number | "all";
  height: number;
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const overlaysRef = useRef<{ markers: any[]; polylines: any[]; info?: any }>({ markers: [], polylines: [] });
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

  useEffect(() => {
    if (!apiKey) return;
    let cancelled = false;
    setStatus("loading");
    loadGoogleMaps(apiKey)
      .then(() => {
        if (!cancelled) setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [apiKey]);

  useEffect(() => {
    if (status !== "ready" || !mapRef.current || !window.google?.maps) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 12,
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        clickableIcons: false,
        gestureHandling: "greedy",
        styles: lightMapStyle
      });
    }

    const map = mapInstanceRef.current;

    // Cleanup previous overlays before redrawing.
    overlaysRef.current.markers.forEach((marker) => marker.setMap(null));
    overlaysRef.current.polylines.forEach((line) => line.setMap(null));
    overlaysRef.current.info?.close();
    overlaysRef.current = { markers: [], polylines: [] };

    if (markers.length === 0) {
      map.setCenter(center);
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();
    const info = new window.google.maps.InfoWindow();
    overlaysRef.current.info = info;

    markers.forEach((marker) => {
      const color = MARKER_COLORS[marker.type] ?? "#0F766E";
      const gMarker = new window.google.maps.Marker({
        position: { lat: marker.lat, lng: marker.lng },
        map,
        title: marker.title,
        label: { text: marker.label, color: "#fff", fontSize: "11px", fontWeight: "700" },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 14,
          fillColor: color,
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2
        }
      });
      gMarker.addListener("click", () => {
        info.setContent(infoWindowContent(marker));
        info.open({ map, anchor: gMarker });
      });
      overlaysRef.current.markers.push(gMarker);
      bounds.extend({ lat: marker.lat, lng: marker.lng });
    });

    // Group markers by day and draw a polyline per group.
    const grouped: Record<string, Marker[]> = {};
    for (const marker of markers) {
      if (marker.day === null || marker.day === undefined) continue;
      const key = String(marker.day);
      grouped[key] = grouped[key] ?? [];
      grouped[key].push(marker);
    }
    Object.entries(grouped).forEach(([day, dayMarkers], index) => {
      if (dayMarkers.length < 2) return;
      const path = dayMarkers.map((m) => ({ lat: m.lat, lng: m.lng }));
      const hotel = markers.find((m) => m.type === "hotel");
      if (hotel) path.unshift({ lat: hotel.lat, lng: hotel.lng });
      const polyline = new window.google.maps.Polyline({
        path,
        map,
        geodesic: true,
        strokeColor: DAY_COLORS[Number(day) % DAY_COLORS.length] ?? DAY_COLORS[index % DAY_COLORS.length],
        strokeOpacity: 0,
        icons: [
          {
            icon: {
              path: "M 0,-1 0,1",
              strokeOpacity: 1,
              scale: 3
            },
            offset: "0",
            repeat: "16px"
          }
        ]
      });
      overlaysRef.current.polylines.push(polyline);
    });

    if (markers.length === 1) {
      map.setCenter({ lat: markers[0].lat, lng: markers[0].lng });
      map.setZoom(13);
    } else {
      map.fitBounds(bounds, 56);
    }
  }, [status, center, markers, selectedDay]);

  if (!apiKey) {
    return (
      <div className="space-y-2">
        <FallbackMap markers={markers} height={height} />
        <p className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          <KeyRound className="h-3.5 w-3.5" />
          Add <code className="rounded bg-muted px-1 py-0.5 font-mono">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to enable the live Google Maps view.
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-muted dark:border-white/10" style={{ height }}>
      <div ref={mapRef} className="absolute inset-0" />
      {status === "loading" ? (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 text-sm text-muted-foreground backdrop-blur-sm">
          <Layers className="mr-2 h-4 w-4 animate-pulse" />
          Loading Google Maps…
        </div>
      ) : null}
      {status === "error" ? (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 p-6 text-sm text-destructive">
          Google Maps failed to load. Check that the API key allows the Maps JavaScript API on this domain.
        </div>
      ) : null}
    </div>
  );
}

function FallbackMap({ markers, height }: { markers: Marker[]; height: number }) {
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
      <div
        className="map-grid flex items-center justify-center rounded-lg border border-border bg-muted/35 text-sm text-muted-foreground dark:border-white/10"
        style={{ height }}
      >
        No map markers yet
      </div>
    );
  }

  const active = positioned.find((marker) => marker.id === activeId);
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-border bg-[#dce8dd] dark:border-white/10 dark:bg-[#07111f]"
      )}
      style={{ height }}
    >
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
        <p className="font-medium">{active?.title ?? "Select a marker"}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {active?.day ? `Day ${active.day} · ` : ""}
          {active?.type ?? "Click route markers to inspect each stop."}
        </p>
      </div>
    </div>
  );
}

function MapLegend({ markers }: { markers: Marker[] }) {
  const types = useMemo(() => Array.from(new Set(markers.map((marker) => marker.type))), [markers]);
  if (types.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {types.map((type) => (
        <span
          key={type}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium capitalize text-muted-foreground"
        >
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: MARKER_COLORS[type] ?? "#0F766E" }} />
          {type}
        </span>
      ))}
    </div>
  );
}

function infoWindowContent(marker: Marker) {
  const dayLine = marker.day ? `Day ${marker.day} · ` : "";
  const search = encodeURIComponent(marker.title);
  return `
    <div style="font-family: ui-sans-serif, system-ui, sans-serif; max-width: 240px;">
      <div style="font-weight: 600; font-size: 13px; color: #0F172A;">${escapeHtml(marker.title)}</div>
      <div style="margin-top: 4px; font-size: 11px; color: #475569; text-transform: capitalize;">${dayLine}${marker.type}</div>
      <a href="https://www.google.com/maps/search/?api=1&query=${search}" target="_blank" rel="noopener noreferrer"
         style="display: inline-flex; align-items: center; gap: 4px; margin-top: 8px; font-size: 11px; color: #0F766E; text-decoration: none; font-weight: 600;">
        Open in Google Maps →
      </a>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function loadGoogleMaps(apiKey: string) {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));
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
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places&v=quarterly`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = "true";
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () => reject(new Error("Google Maps failed to load")));
    document.head.appendChild(script);
  });
}

const lightMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
  { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#e5f3e5" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dadada" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#e5e5e5" }] },
  { featureType: "transit.station", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#cfe6f0" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] }
];
