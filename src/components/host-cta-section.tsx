import {
  ArrowUpRightIcon,
  CheckIcon,
  StarIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const perks = [
  "Set your own hourly rate and availability",
  "Approve requests or turn on instant booking",
  "Get paid 24 hours after each session",
  "Keep 100% of your listed rate — no listing fees",
]

export function HostCtaSection() {
  return (
    <section
      id="for-studios"
      className="scroll-mt-20 border-t border-border/70 bg-secondary/40 py-16 sm:py-20"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-10 lg:p-12">
          <div
            className="studio-grid pointer-events-none absolute inset-0 opacity-30"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-highlight/15 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-16 size-72 rounded-full bg-primary/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col items-start gap-5">
              <Badge variant="highlight" className="px-2.5 py-1">
                For studio owners
              </Badge>

              <h2 className="max-w-xl font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Turn empty hours into booked sessions
              </h2>

              <p className="max-w-xl text-muted-foreground">
                Join a curated marketplace of photographers, musicians,
                filmmakers, and designers who book space by the hour. You keep
                control of your calendar, your pricing, and your house rules.
              </p>

              <ul className="grid gap-2.5 text-sm sm:grid-cols-2">
                {perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <CheckIcon
                      className="mt-0.5 size-4 shrink-0 text-success"
                      aria-hidden="true"
                    />
                    <span className="text-muted-foreground">{perk}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <Button size="lg" render={<a href="#top" />}>
                  Become a host
                  <ArrowUpRightIcon aria-hidden="true" />
                </Button>
                <Button size="lg" variant="outline" render={<a href="#studios" />}>
                  Browse the marketplace
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Card className="gap-4 p-5">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <StarIcon
                      key={index}
                      className="size-4 fill-highlight text-highlight"
                      aria-hidden="true"
                    />
                  ))}
                  <span className="ml-1 text-sm text-muted-foreground">
                    5.0 host rating
                  </span>
                </div>
                <blockquote className="text-sm leading-relaxed text-muted-foreground">
                  “Framio filled the gaps in our calendar without turning the
                  studio into a full-time job. The requests are serious, the
                  payouts are fast, and the dashboard actually tells me
                  something useful.”
                </blockquote>
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    MC
                  </span>
                  <div className="text-sm">
                    <p className="font-medium">Mara Chen</p>
                    <p className="text-muted-foreground">
                      Northlight Studio · Brooklyn
                    </p>
                  </div>
                </div>
              </Card>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-background/70 p-4">
                  <WalletIcon
                    className="size-4 text-primary dark:text-highlight"
                    aria-hidden="true"
                  />
                  <p className="mt-2 font-heading text-lg font-semibold">
                    $3.2k
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Average monthly host earnings
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-background/70 p-4">
                  <TrendingUpIcon
                    className="size-4 text-success"
                    aria-hidden="true"
                  />
                  <p className="mt-2 font-heading text-lg font-semibold">76%</p>
                  <p className="text-xs text-muted-foreground">
                    Median occupancy after 90 days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
