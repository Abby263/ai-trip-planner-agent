"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUp, Bot, LocateFixed, MessageCircle, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LocationPermissionButton } from "@/components/trip/LocationPermissionButton";
import type { PlanTripRequest } from "@/types/trip";

const schema = z.object({
  query: z.string().trim().min(4)
});

type FormValues = z.infer<typeof schema>;

const quickPrompts = [
  "Plan a 3-day trip from Toronto to Delhi with vegetarian food, culture, photography spots, and a balanced pace.",
  "Plan a weekend near me with comedy shows, vegetarian restaurants, and live music.",
  "I have 4 days and CAD 1500. Suggest 3 places from Toronto.",
  "Make this itinerary more relaxed and add shopping."
];

export function TripSearchForm({
  onSubmit,
  loading,
  followUpQuestions = []
}: {
  onSubmit: (payload: PlanTripRequest) => void;
  loading?: boolean;
  followUpQuestions?: string[];
}) {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const [lastFollowUpKey, setLastFollowUpKey] = useState("");
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      query: "Plan a 3-day trip from Toronto to Delhi. I prefer vegetarian food, cultural places, photography spots, and a balanced pace."
    }
  });

  const followUpKey = useMemo(() => followUpQuestions.join("|"), [followUpQuestions]);

  useEffect(() => {
    if (!followUpKey || followUpKey === lastFollowUpKey) return;
    setConversationContext((previous) => [...previous, `Agent: ${followUpQuestions.join(" ")}`]);
    setLastFollowUpKey(followUpKey);
    form.setValue("query", "");
  }, [followUpKey, followUpQuestions, form, lastFollowUpKey]);

  const submitMessage = (values: FormValues) => {
    const userMessage = values.query.trim();
    const transcript = [...conversationContext, `User: ${userMessage}`];
    setConversationContext(transcript);
    form.setValue("query", "");

    onSubmit({
      query: transcript.length > 1 ? transcript.join("\n") : userMessage,
      origin: null,
      destination: null,
      start_date: null,
      end_date: null,
      duration_days: null,
      traveler_count: 1,
      budget: null,
      currency: "CAD",
      preferences: [],
      dietary_preferences: [],
      travel_style: null,
      current_location: currentLocation
    });
  };

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(submitMessage)}>
      <Card className="border-border bg-white/92 shadow-[0_18px_50px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-card/80">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Concierge chat</CardTitle>
            <Badge variant="muted">No manual fields</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 rounded-lg border border-border bg-[#f7f3ea] p-3 dark:border-white/10 dark:bg-background/55">
            <div className="flex items-start gap-3 rounded-lg bg-white p-3 text-sm shadow-sm dark:bg-card/80">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black">
                <Bot className="h-4 w-4" />
              </span>
              <div className="min-w-0 space-y-1">
                <p className="font-semibold text-foreground">{followUpQuestions.length ? "I need one more detail." : "Tell me what you want planned."}</p>
                {followUpQuestions.length ? (
                  <div className="space-y-1 text-muted-foreground">
                    {followUpQuestions.map((question) => (
                      <p key={question}>{question}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Share the trip, weekend, event search, budget, travelers, style, or constraints in one message.</p>
                )}
              </div>
            </div>
            <Label htmlFor="query" className="sr-only">
              Message
            </Label>
            <div className="rounded-lg border border-border bg-white p-3 shadow-sm dark:border-white/10 dark:bg-card/80">
              <Textarea
                id="query"
                placeholder="Ask naturally, or answer the concierge's follow-up..."
                className="min-h-36 resize-none border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0"
                {...form.register("query")}
              />
              <div className="mt-3 flex flex-col gap-3 border-t border-border pt-3 dark:border-white/10">
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((prompt) => (
                    <Button
                      key={prompt}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-auto rounded-full px-3 py-1.5 text-left text-xs"
                      onClick={() => form.setValue("query", prompt, { shouldValidate: true })}
                    >
                      <Sparkles className="h-3 w-3" />
                      {prompt.split(".")[0]}
                    </Button>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MessageCircle className="h-4 w-4" />
                    <span>Details come through chat</span>
                  </div>
                  <Button type="submit" size="icon" className="rounded-full bg-black text-white hover:bg-black/90" disabled={loading} aria-label="Send message">
                    {loading ? <LocateFixed className="h-4 w-4 animate-pulse" /> : <ArrowUp className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <LocationPermissionButton onLocation={setCurrentLocation} />
        </CardContent>
      </Card>
    </form>
  );
}
