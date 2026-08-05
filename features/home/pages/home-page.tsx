import { FeaturedGear } from "../components/featured-gear";
import { HomeCta } from "../components/home-cta";
import { HeroSection } from "../components/hero-section";
import { WhyChooseUs } from "../components/why-choose-us";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <WhyChooseUs />
      <FeaturedGear />
      <HomeCta />
    </main>
  );
}
