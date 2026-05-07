"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const preferences = ["cultural places", "photography spots", "shopping", "live music", "comedy shows", "budget-friendly"];
const dietary = ["vegetarian", "vegan", "jain-friendly"];

export function PreferencePanel({
  selectedPreferences,
  selectedDietary,
  onTogglePreference,
  onToggleDietary
}: {
  selectedPreferences: string[];
  selectedDietary: string[];
  onTogglePreference: (value: string) => void;
  onToggleDietary: (value: string) => void;
}) {
  return (
    <Card className="border-border bg-white/92 dark:border-white/10 dark:bg-card/80">
      <CardHeader>
        <CardTitle>Travel style signals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {preferences.map((preference) => (
            <Button
              key={preference}
              type="button"
              size="sm"
              className="rounded-full"
              variant={selectedPreferences.includes(preference) ? "default" : "outline"}
              onClick={() => onTogglePreference(preference)}
            >
              {preference}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {dietary.map((item) => (
            <Button
              key={item}
              type="button"
              size="sm"
              className="rounded-full"
              variant={selectedDietary.includes(item) ? "secondary" : "outline"}
              onClick={() => onToggleDietary(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
