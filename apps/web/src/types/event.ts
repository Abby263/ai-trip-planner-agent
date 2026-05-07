export interface EventOption {
  id: string;
  name: string;
  category: string;
  venue_name: string;
  address: string;
  lat: number;
  lng: number;
  start_time: string;
  end_time?: string | null;
  price_min?: number | null;
  price_max?: number | null;
  currency: string;
  ticket_url?: string | null;
  provider: string;
  fetched_at: string;
  distance_from_user_or_hotel_km?: number | null;
  why_recommended: string;
}
