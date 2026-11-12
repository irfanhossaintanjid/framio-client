import {
  ArrowRightIcon,
  AudioLinesIcon,
  CameraIcon,
  ClapperboardIcon,
  PaintbrushIcon,
  PodcastIcon,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"

type ProductionType = {
  name: string
  stat: string
  slug: string
  icon: LucideIcon
}

const productionTypes: ProductionType[] = [
  {
    name: "Photo Studios",
    stat: "840+ Daylight & Cyc",
    slug: "photo-studios",
    icon: CameraIcon,
  },
  {
    name: "Sound Stages",
    stat: "310+ Grid & Acoustic",
    slug: "sound-stages",
    icon: ClapperboardIcon,
  },
  {
    name: "Podcast Rooms",
    stat: "490+ Multi-Cam Setups",
    slug: "podcast-rooms",
    icon: PodcastIcon,
  },
  {
    name: "Music Suites",
    stat: "520+ Mixing & Live Booths",
    slug: "music-suites",
    icon: AudioLinesIcon,
  },
  {
    name: "Art Workshops",
    stat: "260+ Open Floor Spaces",
    slug: "art-workshops",
    icon: PaintbrushIcon,
  },
]

const allCategoriesHref = "/studios"

function ViewAllLink({ className }: { className?: string }) {
  return (
    <Link
      href={allCategoriesHref}
      className={`group/link inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 ${className ?? ""}`}
    >
      View all 18 categories
      <ArrowRightIcon
        className="size-4 transition-transform duration-200 group-hover/link:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  )
}

export function BrowseByType() {
  return (
    <section
      aria-labelledby="production-types-heading"
      className="bg-background py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div>
            <p className="text-[0.6875rem] font-bold tracking-[0.14em] text-primary uppercase">
              Architectural Diversity
            </p>
            <h2
              id="production-types-heading"
              className="mt-2.5 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Browse by Production Type
            </h2>
          </div>
          <ViewAllLink className="hidden pb-1.5 md:inline-flex" />
        </div>

        <ul className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {productionTypes.map(({ name, stat, slug, icon: Icon }) => (
            <li key={slug}>
              <Link
                href={`${allCategoriesHref}?category=${slug}`}
                className="group flex h-full flex-col rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-highlight hover:shadow-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-background text-primary transition-colors group-hover:text-primary-hover">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="mt-3 text-base font-bold text-foreground">
                  {name}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  {stat}
                </span>
              </Link>
            </li>
          ))}
        </ul>

       
      </div>
    </section>
  )
}
