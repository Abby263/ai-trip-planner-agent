export interface PlaceOption {
  id: string;
  name: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  rating?: number | null;
  price_level?: string | null;
  provider: string;
  fetched_at: string;
  why_recommended: string;
}
