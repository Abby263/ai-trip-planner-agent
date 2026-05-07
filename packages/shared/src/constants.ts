export const TRIP_OPTION_NAMES = ["Budget Saver", "Smart Balanced", "Premium Experience"] as const;

export const PROGRESS_EVENTS = [
  "intent_parsed",
  "missing_info_checked",
  "researching",
  "searching_flights",
  "searching_hotels",
  "searching_places",
  "searching_events",
  "optimizing_route",
  "building_itinerary",
  "estimating_budget",
  "validating",
  "repairing",
  "completed",
  "failed"
] as const;
