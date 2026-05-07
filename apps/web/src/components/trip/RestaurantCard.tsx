import { Utensils } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SourceBadge } from "@/components/trip/SourceBadge";

export function RestaurantCard({
  name,
  provider,
  description
}: {
  name: string;
  provider: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Utensils className="h-4 w-4 text-primary" />
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>{description}</p>
        <SourceBadge provider={provider} />
      </CardContent>
    </Card>
  );
}
