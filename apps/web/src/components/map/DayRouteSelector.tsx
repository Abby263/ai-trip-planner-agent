"use client";

import { Button } from "@/components/ui/button";

export function DayRouteSelector({
  days,
  selectedDay,
  onSelect
}: {
  days: number[];
  selectedDay: number | "all";
  onSelect: (day: number | "all") => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" size="sm" variant={selectedDay === "all" ? "default" : "outline"} onClick={() => onSelect("all")}>
        All
      </Button>
      {days.map((day) => (
        <Button key={day} type="button" size="sm" variant={selectedDay === day ? "default" : "outline"} onClick={() => onSelect(day)}>
          Day {day}
        </Button>
      ))}
    </div>
  );
}
