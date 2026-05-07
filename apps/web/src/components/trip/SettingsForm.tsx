"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2, Save, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPreferences, updatePreferences, type UserPreferences } from "@/services/preferencesApi";

const PACE_OPTIONS = ["relaxed", "balanced", "packed"] as const;

const DEFAULT_PREFS: UserPreferences = {
  home_city: "Toronto",
  home_airport: "YYZ",
  preferred_currency: "CAD",
  dietary_preferences: ["vegetarian"],
  hotel_preferences: [],
  travel_style: "balanced",
  favorite_activities: ["photography", "cultural places", "scenic cafes"]
};

export function SettingsForm() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["preferences"],
    queryFn: getPreferences
  });
  const mutation = useMutation({
    mutationFn: updatePreferences,
    onSuccess: (saved) => {
      queryClient.setQueryData(["preferences"], saved);
    }
  });

  const [draft, setDraft] = useState<UserPreferences>(DEFAULT_PREFS);

  useEffect(() => {
    if (data) setDraft(data);
  }, [data]);

  const handleListChange = (key: keyof UserPreferences) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setDraft((prev) => ({
      ...prev,
      [key]: event.target.value
        .split(",")
        .map((token) => token.trim())
        .filter(Boolean)
    }));
  };

  const offline = Boolean(error);

  return (
    <Card className="max-w-3xl border-border bg-card">
      <CardHeader className="flex-row items-center justify-between gap-4">
        <CardTitle>Travel defaults</CardTitle>
        {offline ? (
          <Badge variant="outline" className="gap-1 text-muted-foreground">
            <WifiOff className="h-3 w-3" />
            Offline (saving locally)
          </Badge>
        ) : isLoading ? (
          <Badge variant="muted" className="gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Loading
          </Badge>
        ) : (
          <Badge variant="secondary" className="gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Connected
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="home_city">Home city</Label>
            <Input
              id="home_city"
              value={draft.home_city ?? ""}
              onChange={(event) => setDraft((prev) => ({ ...prev, home_city: event.target.value || null }))}
              placeholder="Toronto"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="home_airport">Home airport (IATA)</Label>
            <Input
              id="home_airport"
              value={draft.home_airport ?? ""}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, home_airport: event.target.value.toUpperCase() || null }))
              }
              placeholder="YYZ"
              maxLength={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Preferred currency</Label>
            <Input
              id="currency"
              value={draft.preferred_currency}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  preferred_currency: event.target.value.toUpperCase().slice(0, 3)
                }))
              }
              maxLength={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pace">Travel pace</Label>
            <select
              id="pace"
              value={draft.travel_style ?? ""}
              onChange={(event) => setDraft((prev) => ({ ...prev, travel_style: event.target.value || null }))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">No preference</option>
              {PACE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="dietary">Dietary preferences (comma separated)</Label>
            <Input
              id="dietary"
              value={(draft.dietary_preferences ?? []).join(", ")}
              onChange={handleListChange("dietary_preferences")}
              placeholder="vegetarian, gluten-free"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="activities">Favorite activities (comma separated)</Label>
            <Input
              id="activities"
              value={(draft.favorite_activities ?? []).join(", ")}
              onChange={handleListChange("favorite_activities")}
              placeholder="photography, cultural places, scenic cafes"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="hotels">Hotel preferences (comma separated)</Label>
            <Input
              id="hotels"
              value={(draft.hotel_preferences ?? []).join(", ")}
              onChange={handleListChange("hotel_preferences")}
              placeholder="boutique, central, free breakfast"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 border-t border-border pt-4">
          <Button
            type="button"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate(draft)}
          >
            {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {mutation.isPending ? "Saving" : "Save preferences"}
          </Button>
          {mutation.isSuccess ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
              <CheckCircle2 className="h-3 w-3" />
              Saved
            </span>
          ) : null}
          {mutation.isError ? (
            <span className="text-xs font-medium text-destructive">Save failed — try again.</span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
