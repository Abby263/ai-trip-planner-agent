import { BadgeCheck, MessageCircle, Route, Search, Utensils } from "lucide-react";

const interestChips = [
  { label: "Fine dining", top: "22%", left: "66%" },
  { label: "Beach", top: "42%", left: "46%" },
  { label: "Historical tours", top: "72%", left: "18%" },
  { label: "Vegetarian food", top: "58%", left: "62%" },
  { label: "Photography", top: "24%", left: "16%" },
  { label: "Live events", top: "78%", left: "58%" }
];

const steps = [
  { title: "Start with a request", body: "Describe a destination, weekend idea, budget, or refinement in plain language.", icon: MessageCircle },
  { title: "Tools gather options", body: "Providers return flights, hotels, places, events, weather, routes, and price metadata.", icon: Search },
  { title: "Route the trip", body: "The planner sequences days with map markers, travel times, pace, meals, and rest windows.", icon: Route },
  { title: "Validate before sharing", body: "The graph checks feasibility, source coverage, warnings, budget, and booking safety.", icon: BadgeCheck }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20 text-black dark:bg-background dark:text-foreground">
      <div className="container">
        <h2 className="text-center text-5xl font-black leading-tight md:text-7xl">How it works</h2>
        <div className="relative mx-auto mt-12 h-[520px] max-w-5xl overflow-hidden rounded-lg bg-slate-50">
          <div className="absolute left-[38%] top-[28%] flex h-40 w-40 items-center justify-center rounded-full border-8 border-white bg-[#ffd34d] shadow-[0_22px_70px_rgba(15,23,42,0.16)]">
            <Utensils className="h-12 w-12" />
          </div>
          <div className="absolute left-[8%] top-[25%] h-36 w-44 overflow-hidden rounded-lg shadow-[0_18px_45px_rgba(15,23,42,0.14)]">
            <div className="h-full bg-[url('https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=700&q=85')] bg-cover bg-center" />
          </div>
          <div className="absolute left-[34%] top-[10%] h-32 w-36 overflow-hidden rounded-lg shadow-[0_18px_45px_rgba(15,23,42,0.14)]">
            <div className="h-full bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=85')] bg-cover bg-center" />
          </div>
          <div className="absolute right-[11%] top-[24%] h-36 w-44 overflow-hidden rounded-lg shadow-[0_18px_45px_rgba(15,23,42,0.14)]">
            <div className="h-full bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=700&q=85')] bg-cover bg-center" />
          </div>
          <div className="absolute bottom-[10%] left-[18%] h-32 w-40 overflow-hidden rounded-lg shadow-[0_18px_45px_rgba(15,23,42,0.14)]">
            <div className="h-full bg-[url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=700&q=85')] bg-cover bg-center" />
          </div>
          <div className="absolute bottom-[8%] right-[24%] h-36 w-44 overflow-hidden rounded-lg shadow-[0_18px_45px_rgba(15,23,42,0.14)]">
            <div className="h-full bg-[url('https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=700&q=85')] bg-cover bg-center" />
          </div>
          {interestChips.map((chip) => (
            <div
              key={chip.label}
              className="absolute rounded-full border border-border bg-white px-4 py-3 text-sm font-semibold shadow-[0_12px_30px_rgba(15,23,42,0.1)]"
              style={{ top: chip.top, left: chip.left }}
            >
              {chip.label}
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <article key={step.title} className="rounded-lg border border-border bg-card p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between">
                <step.icon className="h-6 w-6 text-primary" />
                <span className="font-mono text-sm text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
