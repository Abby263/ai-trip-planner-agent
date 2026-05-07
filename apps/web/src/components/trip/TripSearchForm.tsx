"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, CircleDollarSign, MapPin, Plus, Send, Smile, Users } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LocationPermissionButton } from "@/components/trip/LocationPermissionButton";
import { PreferencePanel } from "@/components/trip/PreferencePanel";
import type { PlanTripRequest } from "@/types/trip";

const schema = z.object({
  query: z.string().min(4),
  origin: z.string().optional(),
  destination: z.string().optional(),
  duration_days: z.coerce.number().min(1).max(45).optional(),
  traveler_count: z.coerce.number().min(1).max(12),
  budget: z.coerce.number().optional(),
  currency: z.string().length(3),
  travel_style: z.enum(["relaxed", "balanced", "packed"])
});

type FormValues = z.infer<typeof schema>;

export function TripSearchForm({ onSubmit, loading }: { onSubmit: (payload: PlanTripRequest) => void; loading?: boolean }) {
  const [preferences, setPreferences] = useState(["cultural places", "photography spots"]);
  const [dietary, setDietary] = useState(["vegetarian"]);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      query: "Plan a 3-day trip from Toronto to Delhi. I prefer vegetarian food, cultural places, photography spots, and a balanced pace.",
      origin: "Toronto",
      destination: "Delhi",
      duration_days: 3,
      traveler_count: 1,
      currency: "CAD",
      travel_style: "balanced"
    }
  });

  const toggle = (value: string, values: string[], setter: (next: string[]) => void) => {
    setter(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  };

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) =>
        onSubmit({
          query: values.query,
          origin: values.origin || null,
          destination: values.destination || null,
          duration_days: values.duration_days || null,
          traveler_count: values.traveler_count,
          budget: values.budget || null,
          currency: values.currency.toUpperCase(),
          preferences,
          dietary_preferences: dietary,
          travel_style: values.travel_style,
          current_location: currentLocation
        })
      )}
    >
      <Card className="border-border bg-white/92 shadow-[0_18px_50px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-card/80">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Ask us anything</CardTitle>
            <Badge variant="muted">Mock-ready</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border bg-background p-3 dark:border-white/10">
            <Label htmlFor="query" className="sr-only">
              Request
            </Label>
            <Textarea id="query" className="min-h-32 border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0" {...form.register("query")} />
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3 dark:border-white/10">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white dark:border-white/10 dark:bg-card">
                  <Plus className="h-4 w-4" />
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white dark:border-white/10 dark:bg-card">
                  <Smile className="h-4 w-4" />
                </span>
              </div>
              <Button type="submit" size="icon" className="rounded-full bg-black text-white hover:bg-black/90" disabled={loading} aria-label="Generate trip">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="origin">
                <MapPin className="mr-1 inline h-3 w-3 text-primary" />
                Origin
              </Label>
              <Input id="origin" {...form.register("origin")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">
                <MapPin className="mr-1 inline h-3 w-3 text-secondary" />
                Destination
              </Label>
              <Input id="destination" {...form.register("destination")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration_days">
                <CalendarDays className="mr-1 inline h-3 w-3 text-primary" />
                Days
              </Label>
              <Input id="duration_days" type="number" {...form.register("duration_days")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">
                <CircleDollarSign className="mr-1 inline h-3 w-3 text-secondary" />
                Budget
              </Label>
              <Input id="budget" type="number" placeholder="Optional" {...form.register("budget")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" {...form.register("currency")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="traveler_count">
                <Users className="mr-1 inline h-3 w-3 text-primary" />
                Travelers
              </Label>
              <Input id="traveler_count" type="number" {...form.register("traveler_count")} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-lg border border-border bg-background/70 p-1 dark:border-white/10 dark:bg-background/45">
            {(["relaxed", "balanced", "packed"] as const).map((pace) => (
              <Button key={pace} type="button" variant={form.watch("travel_style") === pace ? "default" : "outline"} onClick={() => form.setValue("travel_style", pace)}>
                {pace}
              </Button>
            ))}
          </div>
          <LocationPermissionButton onLocation={setCurrentLocation} />
        </CardContent>
      </Card>
      <PreferencePanel
        selectedPreferences={preferences}
        selectedDietary={dietary}
        onTogglePreference={(value) => toggle(value, preferences, setPreferences)}
        onToggleDietary={(value) => toggle(value, dietary, setDietary)}
      />
      <Button type="submit" size="lg" className="h-[52px] w-full rounded-full bg-black text-white hover:bg-black/90" disabled={loading}>
        <Send className="h-4 w-4" />
        {loading ? "Generating trip" : "Generate trip"}
      </Button>
    </form>
  );
}
