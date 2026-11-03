import {
  BadgeCheckIcon,
  ClapperboardIcon,
  Clock3Icon,
  CompassIcon,
  HeadsetIcon,
  ShieldCheckIcon,
  WrenchIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react"

type Guarantee = {
  title: string
  description: string
  icon: LucideIcon
}

const bookingSteps = [
  {
    number: "01",
    title: "Discover Spaces",
    description:
      "Filter by natural light angles, power phase, cyc wall dimensions, acoustic space, and neighborhood geo-markets.",
    icon: CompassIcon,
  },
  {
    number: "02",
    title: "Select Shoot Hours",
    description:
      "Book only the time you need with transparent hourly rates. Add load-in buffers and cleaning add-ons seamlessly.",
    icon: Clock3Icon,
  },
  {
    number: "03",
    title: "Book Instantly",
    description:
      "Secure reservations on instant-book stages. Get approvals in under 2 hours with automated digital entry codes.",
    icon: ZapIcon,
  },
  {
    number: "04",
    title: "Create & Produce",
    description:
      "Arrive, check in via mobile key, and shoot with peace of mind — backed by $1M protection and on-call stage managers.",
    icon: ClapperboardIcon,
  },
]

const guarantees: Guarantee[] = [
  {
    title: "$1M Property Protection",
    description:
      "Comprehensive liability and structural damage guarantee covering host facilities and production gear.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Verified Creator Profiles",
    description:
      "Government ID, portfolio verification, and past reviews for photographers, directors, and production crews.",
    icon: BadgeCheckIcon,
  },
  {
    title: "Equipment Safety Standards",
    description:
      "Pre-verified grid-rigging certifications, electrical fire inspections, and safe soundproof access standards.",
    icon: WrenchIcon,
  },
  {
    title: "24/7 Concierge Support",
    description:
      "Real human studio dispatchers ready to assist with lockouts, schedule extensions, and equipment hot-swaps.",
    icon: HeadsetIcon,
  },
]

export function AboutUs() {
  return (
    <>
      <section
      id="how-it-works"
        aria-labelledby="booking-works-heading"
        className="bg-background py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="mx-auto max-w-3xl text-center">
            <p className="text-[0.6875rem] font-bold tracking-[0.14em] text-primary uppercase">
              Seamless Production Pipeline
            </p>
            <h2
              id="booking-works-heading"
              className="mt-2.5 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              How Booking Works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              From scouting through wrap-up, Framio keeps creative logistics
              predictable, insured, and{" "}
              <span className="font-semibold text-highlight">
                friction-free.
              </span>
            </p>
          </header>

          <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
            {bookingSteps.map(({ number, title, description, icon: Icon }) => (
              <li
                key={number}
                className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <span
                    aria-hidden="true"
                    className="font-heading text-5xl leading-none font-bold tracking-tight text-foreground/20"
                  >
                    {number}
                  </span>
                  <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="mt-5 text-base font-bold text-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
      id = "about"
        aria-labelledby="host-guarantee-heading"
        className=" text-white sm:py-20 lg:py-24"
      >
        <div className="mx-auto bg-[#071521] py-20 rounded-xl w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="max-w-3xl">
            <p className="text-[0.6875rem] font-bold tracking-[0.14em] text-[#19a7ce] uppercase">
              Built for Professional Productions
            </p>
            <h2
              id="host-guarantee-heading"
              className="mt-2.5 max-w-2xl font-heading text-3xl leading-tight font-bold tracking-tight text-white sm:text-4xl"
            >
              Every booking protected from roll to wrap.
            </h2>
          </header>

          <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
            {guarantees.map(({ title, description, icon: Icon }) => (
              <li key={title}>
                <span className="flex size-10 items-center justify-center rounded-lg bg-[#29495d] text-[#19a7ce]">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#bdccd7]">
                  {description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
