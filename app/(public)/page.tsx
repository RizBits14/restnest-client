import { FeaturedPropertiesSection } from "@/components/home/featured-properties-section";
import { HeroSection } from "@/components/home/hero-section";
import { ReviewsMarqueeSection } from "@/components/home/reviews-marquee-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedPropertiesSection />
      <ReviewsMarqueeSection />
    </>
  );
}