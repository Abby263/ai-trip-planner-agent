"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ItineraryOptionCard } from "@/components/trip/ItineraryOptionCard";
import { usePlannerStore } from "@/stores/plannerStore";
import type { ItineraryOption } from "@/types/trip";

export function ItineraryOptionTabs({ options }: { options: ItineraryOption[] }) {
  const selectedOptionId = usePlannerStore((state) => state.selectedOptionId) ?? options[1]?.id ?? options[0]?.id;
  const setSelectedOptionId = usePlannerStore((state) => state.setSelectedOptionId);

  if (!selectedOptionId) return null;

  return (
    <Tabs value={selectedOptionId} onValueChange={setSelectedOptionId}>
      <TabsList className="w-full justify-start overflow-x-auto">
        {options.map((option) => (
          <TabsTrigger key={option.id} value={option.id}>{option.name}</TabsTrigger>
        ))}
      </TabsList>
      {options.map((option) => (
        <TabsContent key={option.id} value={option.id}>
          <ItineraryOptionCard option={option} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
