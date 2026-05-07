import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BudgetBreakdown } from "@/components/trip/BudgetBreakdown";
import { ItineraryOptionCard } from "@/components/trip/ItineraryOptionCard";
import { TripMap } from "@/components/map/TripMap";
import type { BudgetSummary, ItineraryOption, MapData } from "@/types/trip";

const budget: BudgetSummary = {
  currency: "CAD",
  items: [{ category: "Flights", amount: 1000, currency: "CAD", confidence: "estimated", notes: "Mock fare" }],
  subtotal: 1000,
  buffer: 100,
  total_estimate: 1100,
  budget_status: "unknown"
};

const option: ItineraryOption = {
  id: "option_balanced",
  name: "Smart Balanced",
  best_for: "A first-time visitor.",
  pace: "balanced",
  estimated_total: 1100,
  currency: "CAD",
  confidence: "medium",
  highlights: ["Vegetarian-friendly restaurants"],
  flight: null,
  hotel: null,
  events: [],
  days: [
    {
      day_number: 1,
      title: "Central Delhi",
      theme: "Arrival",
      activities: [
        {
          id: "act_1",
          start_time: "09:00",
          end_time: "10:00",
          title: "India Gate",
          category: "landmark",
          description: "Photo stop",
          address: "Delhi",
          lat: 28.61,
          lng: 77.22,
          estimated_cost: 0,
          currency: "CAD",
          booking_required: false,
          source_provider: "MockPlacesProvider",
          confidence: "medium"
        }
      ]
    }
  ],
  budget_summary: budget,
  warnings: [],
  booking_links: []
};

const mapData: MapData = {
  center: { lat: 28.61, lng: 77.22 },
  markers: [{ id: "act_1", label: "1", type: "attraction", title: "India Gate", lat: 28.61, lng: 77.22, day: 1 }],
  routes: []
};

describe("trip components", () => {
  it("renders the budget breakdown", () => {
    render(<BudgetBreakdown budget={budget} />);
    expect(screen.getByText("Total estimate")).toBeInTheDocument();
    expect(screen.getByText("Flights")).toBeInTheDocument();
  });

  it("renders an itinerary option card", () => {
    render(<ItineraryOptionCard option={option} />);
    expect(screen.getByText("Smart Balanced")).toBeInTheDocument();
    expect(screen.getByText("India Gate")).toBeInTheDocument();
  });

  it("renders the mock map marker", () => {
    render(<TripMap mapData={mapData} />);
    expect(screen.getByText("Route intelligence")).toBeInTheDocument();
    expect(screen.getByTitle("India Gate")).toBeInTheDocument();
  });
});
