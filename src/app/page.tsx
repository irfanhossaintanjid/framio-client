import { HeroCarousel } from "@/components/homepage/hero-carousel"
import { BrowseByType } from "@/components/homepage/browse-by-type"
import { AboutUs } from "@/components/homepage/aboutUs"

export default function HomePage() {
  return (
    <div>
      <HeroCarousel />
      <BrowseByType />
      <AboutUs/>
    </div>
  );
}