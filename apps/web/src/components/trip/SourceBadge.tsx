import { Database } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function SourceBadge({ provider }: { provider: string }) {
  return (
    <Badge variant="outline" className="gap-1">
      <Database className="h-3 w-3" />
      {provider}
    </Badge>
  );
}
