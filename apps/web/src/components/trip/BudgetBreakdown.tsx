import { WalletCards } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/utils";
import type { BudgetSummary } from "@/types/trip";

export function BudgetBreakdown({ budget }: { budget: BudgetSummary }) {
  return (
    <Card className="border-border bg-white/95 dark:border-white/10 dark:bg-card/85">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <WalletCards className="h-4 w-4 text-primary" />
          Budget
        </CardTitle>
        <Badge variant={budget.budget_status === "over_budget" ? "outline" : "secondary"}>{budget.budget_status.replace("_", " ")}</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {budget.items.map((item) => (
          <div key={item.category} className="rounded-lg border border-border bg-[#f7f3ea] p-3 text-sm dark:border-white/10 dark:bg-background/45">
            <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium">{item.category}</p>
              <p className="text-xs text-muted-foreground">{item.confidence} · {item.notes}</p>
            </div>
            <span className="font-semibold">{formatMoney(item.amount, budget.currency)}</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, (item.amount / budget.subtotal) * 100)}%` }} />
            </div>
          </div>
        ))}
        <div className="border-t pt-3">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Buffer</span>
            <span>{formatMoney(budget.buffer, budget.currency)}</span>
          </div>
          <div className="mt-2 flex justify-between text-lg font-semibold">
            <span>Total estimate</span>
            <span>{formatMoney(budget.total_estimate, budget.currency)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
