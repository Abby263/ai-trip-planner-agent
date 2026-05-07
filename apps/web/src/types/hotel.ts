export interface HotelOption {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  lat: number;
  lng: number;
  rating?: number | null;
  price_per_night: number;
  total_price: number;
  currency: string;
  amenities: string[];
  cancellation_policy?: string | null;
  booking_url?: string | null;
  provider: string;
  fetched_at: string;
  price_confidence: "live" | "cached" | "estimated";
  ranking_reason: string;
}
