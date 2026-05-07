import { CalendarDays, MapPinned, Sparkles, Users } from "lucide-react";

const features = [
  {
    title: "Events",
    body: "Find concerts, comedy, markets, family plans, and evening experiences that match the trip vibe.",
    icon: CalendarDays,
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "Saved pins",
    body: "Turn places, screenshots, and recommendations into collections that can become route-ready plans.",
    icon: MapPinned,
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "Personalized plans",
    body: "Generate options around dietary needs, pace, hotel style, budget, mobility, and preferred activities.",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "Plan together",
    body: "Refine the itinerary, compare options, and keep sources, warnings, and booking links in one place.",
    icon: Users,
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=85"
  }
];

export function FeatureCards() {
  return (
    <section className="bg-background py-16">
      <div className="container">
        <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">New in Concierge AI</p>
            <h2 className="mt-3 max-w-3xl text-4xl font-black leading-tight md:text-6xl">Everything you need for the next adventure.</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            A travel planning interface built around visual places, live-provider-ready tools, route checks, and booking-safe actions.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <article key={feature.title} className="overflow-hidden rounded-lg border border-border bg-card shadow-[0_18px_50px_rgba(15,23,42,0.1)]">
              <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${feature.image})` }} />
              <div className="p-5">
                <feature.icon className="mb-4 h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
