import { HeroCarousel } from "@/components/homepage/hero-carousel"
import { BrowseByType } from "@/components/homepage/browse-by-type"
import { AboutUs } from "@/components/homepage/aboutUs"
import { FeaturedStudios } from "@/components/homepage/featured-studios"

export default function HomePage() {
  return (
    <div>
      <HeroCarousel />
      <BrowseByType />
      <FeaturedStudios />
      <AboutUs/>
    </div>
  );
}
