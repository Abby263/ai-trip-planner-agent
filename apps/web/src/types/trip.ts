import type { EventOption } from "./event";
import type { FlightOption } from "./flight";
import type { HotelOption } from "./hotel";

export type TripStatus = "queued" | "running" | "completed" | "needs_input" | "failed";
export type TravelPace = "relaxed" | "balanced" | "packed";

export interface PlanTripRequest {
  query: string;
  origin?: string | null;
  destination?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  duration_days?: number | null;
  traveler_count: number;
  budget?: number | null;
  currency: string;
  preferences: string[];
  dietary_preferences: string[];
  travel_style?: TravelPace | null;
  current_location?: { lat: number; lng: number } | null;
}

export interface ProgressEvent {
  event: string;
  label: string;
  status: "queued" | "running" | "completed" | "failed";
  detail?: string | null;
  timestamp: string;
}

export interface ItineraryActivity {
  id: string;
  start_time: string;
  end_time: string;
  title: string;
  category: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  estimated_cost: number;
  currency: string;
  travel_time_from_previous_minutes?: number | null;
  booking_required: boolean;
  booking_url?: string | null;
  source_provider: string;
  confidence: "high" | "medium" | "low";
}

export interface ItineraryDay {
  day_number: number;
  date?: string | null;
  title: string;
  theme: string;
  activities: ItineraryActivity[];
}

export interface BudgetItem {
  category: string;
  amount: number;
  currency: string;
  confidence: "live" | "cached" | "estimated";
  notes: string;
}

export interface BudgetSummary {
  currency: string;
  items: BudgetItem[];
  subtotal: number;
  buffer: number;
  total_estimate: number;
  budget_status: "under_budget" | "near_budget" | "over_budget" | "unknown";
}

export interface BookingLink {
  label: string;
  url: string;
  provider: string;
  link_type: "flight" | "hotel" | "event" | "restaurant" | "activity";
  fetched_at: string;
}

export interface ItineraryOption {
  id: string;
  name: string;
  best_for: string;
  pace: TravelPace;
  estimated_total: number;
  currency: string;
  confidence: "high" | "medium" | "low";
  highlights: string[];
  flight?: FlightOption | null;
  hotel?: HotelOption | null;
  events: EventOption[];
  days: ItineraryDay[];
  budget_summary?: BudgetSummary | null;
  warnings: string[];
  booking_links: BookingLink[];
}

export interface MapMarker {
  id: string;
  label: string;
  type: "airport" | "hotel" | "attraction" | "restaurant" | "event";
  title: string;
  lat: number;
  lng: number;
  day?: number | null;
}

export interface RouteSegment {
  from_activity_id: string;
  to_activity_id: string;
  mode: "walking" | "driving" | "transit" | "mixed";
  distance_km: number;
  duration_minutes: number;
  polyline?: string | null;
  provider: string;
}

export interface MapData {
  center: { lat: number; lng: number };
  markers: MapMarker[];
  routes: { day: number; segments: RouteSegment[] }[];
}

export interface SourceCitation {
  provider: string;
  source_type: string;
  source_url?: string | null;
  fetched_at: string;
  confidence: string;
}

export interface FinalTripResponse {
  trip_id: string;
  summary: {
    title: string;
    origin?: string | null;
    destination?: string | null;
    duration_days?: number | null;
    traveler_count: number;
    currency: string;
    assumptions: string[];
  };
  options: ItineraryOption[];
  map_data: MapData;
  booking_links: BookingLink[];
  warnings: string[];
  sources: SourceCitation[];
  validation_report?: Record<string, unknown> | null;
}

export interface PlanTripResponse {
  trip_id: string;
  status: TripStatus;
  follow_up_questions: string[];
  result?: FinalTripResponse | null;
}
