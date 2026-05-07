import { apiClient } from "@/services/apiClient";

export interface UserPreferences {
  home_city: string | null;
  home_airport: string | null;
  preferred_currency: string;
  dietary_preferences: string[];
  hotel_preferences: string[];
  travel_style: string | null;
  favorite_activities: string[];
}

export function getPreferences() {
  return apiClient<UserPreferences>("/api/users/preferences");
}

export function updatePreferences(payload: Partial<UserPreferences>) {
  return apiClient<UserPreferences>("/api/users/preferences", {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}
