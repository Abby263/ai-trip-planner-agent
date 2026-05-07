import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { compactDateTime } from "@/lib/utils";
import type { BookingLink } from "@/types/trip";

export function BookingLinksPanel({ links }: { links: BookingLink[] }) {
  return (
    <Card className="border-border bg-white/95 dark:border-white/10 dark:bg-card/85">
      <CardHeader>
        <CardTitle>Booking links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {links.slice(0, 8).map((link) => (
          <div key={`${link.url}-${link.label}`} className="rounded-lg border border-border bg-[#f7f3ea] p-3 dark:border-white/10 dark:bg-background/45">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{link.label}</p>
                <p className="text-xs text-muted-foreground">{link.provider} · {compactDateTime(link.fetched_at)}</p>
              </div>
              <Button asChild size="sm" variant="outline">
                <a href={link.url} target="_blank" rel="noreferrer" aria-label={link.label}>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
