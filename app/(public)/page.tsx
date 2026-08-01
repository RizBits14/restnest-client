import { FeaturedPropertiesSection } from "@/components/home/featured-properties-section";
import { HeroSection } from "@/components/home/hero-section";
import { PlatformExperienceSection } from "@/components/home/platform-experience-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedPropertiesSection />
      <PlatformExperienceSection />
    </>
  );
}