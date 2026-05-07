export type Confidence = "high" | "medium" | "low";
export type PriceConfidence = "live" | "cached" | "estimated";
export type TravelPace = "relaxed" | "balanced" | "packed";
export type TripStatus = "queued" | "running" | "completed" | "needs_input" | "failed";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface SourceCitation {
  provider: string;
  source_type: string;
  source_url?: string | null;
  fetched_at: string;
  confidence: PriceConfidence | Confidence;
}
