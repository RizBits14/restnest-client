import { FeaturedPropertiesSection } from "@/components/home/featured-properties-section";
import { HeroSection } from "@/components/home/hero-section";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturedPropertiesSection />
    </main>
  );
}