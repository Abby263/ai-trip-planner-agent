import { FeatureCards } from "@/components/landing/FeatureCards";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PreviewMap } from "@/components/landing/PreviewMap";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeatureCards />
      <HowItWorks />
      <PreviewMap />
    </main>
  );
}
