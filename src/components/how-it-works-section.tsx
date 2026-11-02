import {
  CalendarCheck2Icon,
  KeyRoundIcon,
  SearchIcon,
  ShieldCheckIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"

const steps = [
  {
    icon: SearchIcon,
    title: "Find the room",
    description:
      "Filter by discipline, city, capacity, and price. Every listing has real photos, honest capacity limits, and transparent hourly rates.",
  },
  {
    icon: CalendarCheck2Icon,
    title: "Lock in your time",
    description:
      "Instant-book or send a request. You see the full total before you confirm, with no surprise cleaning or platform fees at checkout.",
  },
  {
    icon: KeyRoundIcon,
    title: "Show up and create",
    description:
      "Your host meets you at the door with the space ready to go. Plans change? Reschedule free up to 48 hours before your session.",
  },
]

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-t border-border/70 bg-secondary/40 py-16 sm:py-20"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-wide text-link uppercase">
              How it works
            </p>
            <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Three steps from idea to shoot day
            </h2>
            <p className="mt-2 text-muted-foreground">
              Framio keeps booking simple so you can spend your energy on the
              work, not the logistics.
            </p>
          </div>
          <Badge variant="success" className="w-fit gap-1.5 px-2.5 py-1">
            <ShieldCheckIcon aria-hidden="true" />
            Every host is vetted
          </Badge>
        </div>

        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <li
                key={step.title}
                className="relative flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:bg-card-hover"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/15 dark:text-highlight">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="font-heading text-3xl font-semibold text-border">
                    0{index + 1}
                  </span>
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>

        <div className="mt-6 flex flex-col items-start justify-between gap-3 rounded-xl border border-border bg-card px-5 py-4 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              The Framio guarantee:
            </span>{" "}
            if a studio isn&apos;t as described, we&apos;ll help you rebook or
            refund the session.
          </p>
          <a
            href="#studios"
            className="text-sm font-medium text-link underline-offset-4 hover:underline"
          >
            Start exploring →
          </a>
        </div>
      </div>
    </section>
  )
}
