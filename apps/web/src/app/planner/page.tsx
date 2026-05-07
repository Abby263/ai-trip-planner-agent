import { Suspense } from "react";

import { PlannerExperience } from "@/components/trip/PlannerExperience";

export default function PlannerPage() {
  return (
    <Suspense fallback={null}>
      <PlannerExperience />
    </Suspense>
  );
}
