export interface FlightOption {
  id: string;
  airline: string;
  flight_number?: string | null;
  origin_airport: string;
  destination_airport: string;
  departure_time: string;
  arrival_time: string;
  duration_minutes: number;
  stops: number;
  layovers: string[];
  cabin_class: string;
  price: number;
  currency: string;
  baggage_note?: string | null;
  booking_url?: string | null;
  provider: string;
  fetched_at: string;
  price_confidence: "live" | "cached" | "estimated";
  ranking_reason: string;
}
