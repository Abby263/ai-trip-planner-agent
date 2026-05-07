import { Clock3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { compactDateTime } from "@/lib/utils";

export function PriceFreshnessBadge({ fetchedAt, confidence }: { fetchedAt: string; confidence: string }) {
  return (
    <Badge variant={confidence === "live" ? "default" : "muted"} className="gap-1">
      <Clock3 className="h-3 w-3" />
      {confidence} · {compactDateTime(fetchedAt)}
    </Badge>
  );
}
