import { BedDouble, Star } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriceFreshnessBadge } from "@/components/trip/PriceFreshnessBadge";
import { SourceBadge } from "@/components/trip/SourceBadge";
import { formatMoney } from "@/lib/utils";
import type { HotelOption } from "@/types/hotel";

export function HotelCard({ hotel }: { hotel: HotelOption }) {
  return (
    <Card className="border-border bg-white/95 dark:border-white/10 dark:bg-card/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BedDouble className="h-4 w-4 text-primary" />
          {hotel.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">{hotel.neighborhood}</span>
          <span className="font-semibold">{formatMoney(hotel.total_price, hotel.currency)}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Star className="h-4 w-4 text-secondary" />
          {hotel.rating ?? "N/A"} · {formatMoney(hotel.price_per_night, hotel.currency)}/night
        </div>
        <p className="text-muted-foreground">{hotel.ranking_reason}</p>
        <div className="flex flex-wrap gap-2">
          <SourceBadge provider={hotel.provider} />
          <PriceFreshnessBadge fetchedAt={hotel.fetched_at} confidence={hotel.price_confidence} />
        </div>
      </CardContent>
    </Card>
  );
}
