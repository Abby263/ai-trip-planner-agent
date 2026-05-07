import { TripMap } from "@/components/map/TripMap";

const mapData = {
  center: { lat: 28.6289, lng: 77.2195 },
  markers: [
    { id: "h", label: "H", type: "hotel" as const, title: "Connaught Place", lat: 28.6289, lng: 77.2195, day: null },
    { id: "1", label: "1", type: "attraction" as const, title: "India Gate", lat: 28.6129, lng: 77.2295, day: 1 },
    { id: "2", label: "2", type: "restaurant" as const, title: "Saravana Bhavan", lat: 28.6326, lng: 77.2197, day: 1 },
    { id: "3", label: "3", type: "event" as const, title: "Sufi Music Evening", lat: 28.5899, lng: 77.226, day: 3 }
  ],
  routes: []
};

export function PreviewMap() {
  return (
    <section className="bg-[#f7f3ea] py-16 dark:bg-background">
      <div className="container grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Map-first planning</p>
          <h2 className="mt-3 text-4xl font-black leading-tight md:text-6xl">See the trip, not just the text.</h2>
          <p className="mt-5 max-w-md text-sm leading-6 text-muted-foreground">
            Each option becomes places, day routes, cost lines, source badges, warnings, and booking-safe links that the user can inspect.
          </p>
        </div>
        <TripMap mapData={mapData} />
      </div>
    </section>
  );
}
