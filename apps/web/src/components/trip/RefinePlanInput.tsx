"use client";

import { Wand2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useRefineTrip } from "@/hooks/useTripPlan";
import { usePlannerStore } from "@/stores/plannerStore";

export function RefinePlanInput({ tripId }: { tripId?: string | null }) {
  const [instruction, setInstruction] = useState("Make it more relaxed and add shopping.");
  const selectedOptionId = usePlannerStore((state) => state.selectedOptionId);
  const mutation = useRefineTrip();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Refine plan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea value={instruction} onChange={(event) => setInstruction(event.target.value)} />
        <Button
          type="button"
          className="w-full"
          disabled={!tripId || mutation.isPending}
          onClick={() => tripId && mutation.mutate({ tripId, instruction, selectedOptionId: selectedOptionId ?? undefined })}
        >
          <Wand2 className="h-4 w-4" />
          {mutation.isPending ? "Refining" : "Apply refinement"}
        </Button>
      </CardContent>
    </Card>
  );
}
