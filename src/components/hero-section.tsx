import {
  ArrowRightIcon,
  CalendarCheckIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
} from "lucide-react"

import { StudioVisual } from "@/components/studio-visual"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const stats = [
  { value: "1,200+", label: "Curated studios" },
  { value: "48k", label: "Sessions booked" },
  { value: "4.9", label: "Average rating" },
  { value: "6", label: "Cities live" },
]

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative scroll-mt-16 overflow-hidden border-b border-border/70"
    >
      <div className="studio-grid absolute inset-0 opacity-40" aria-hidden="true" />
      <div
        className="absolute -top-40 left-1/2 h-[28rem] w-[52rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl dark:bg-highlight/10"
        aria-hidden="true"
      />
      <div
        className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-highlight/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:py-24">
        <div className="flex flex-col items-start gap-6">
          <Badge variant="outline" className="gap-1.5 bg-card/70 backdrop-blur-sm">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-highlight opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-highlight" />
            </span>
            Now booking in 6 cities
          </Badge>

          <h1 className="max-w-2xl font-heading text-4xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Book the studio that{" "}
            <span className="relative whitespace-nowrap text-link">
              makes it real
              <span
                className="absolute inset-x-0 -bottom-1 h-1 rounded-full bg-highlight/40"
                aria-hidden="true"
              />
            </span>
            .
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            Photography, music, film, and design spaces — vetted, priced up
            front, and ready when you are. Find the room, lock in your time, and
            get back to the work.
          </p>

          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <Button size="lg" render={<a href="#studios" />}>
              Explore studios
              <ArrowRightIcon aria-hidden="true" />
            </Button>
            <Button size="lg" variant="outline" render={<a href="#how-it-works" />}>
              <SparklesIcon aria-hidden="true" />
              How it works
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheckIcon className="size-4 text-success" aria-hidden="true" />
              Vetted hosts only
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarCheckIcon
                className="size-4 text-success"
                aria-hidden="true"
              />
              Free rescheduling
            </span>
            <span className="flex items-center gap-1">
              <StarIcon
                className="size-4 fill-highlight text-highlight"
                aria-hidden="true"
              />
              4.9 from 12,000+ creators
            </span>
          </div>

          <dl className="mt-2 grid w-full max-w-lg grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-border/70 bg-card/60 px-3 py-2.5 backdrop-blur-sm"
              >
                <dt className="text-xs text-muted-foreground">{stat.label}</dt>
                <dd className="font-heading text-lg font-semibold">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:ml-auto">
          <div
            className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-primary/10 via-transparent to-highlight/15 blur-2xl"
            aria-hidden="true"
          />

          <Card className="relative gap-0 p-0 shadow-xl">
            <StudioVisual discipline="Photography" className="h-56 w-full" />
            <div className="flex items-start justify-between gap-3 p-4 pb-3">
              <div>
                <p className="font-heading text-lg font-semibold">
                  Northlight Studio
                </p>
                <p className="text-sm text-muted-foreground">
                  Brooklyn, NY · Photography
                </p>
              </div>
              <Badge variant="success">Instant book</Badge>
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-border/70 px-4 py-3 text-sm">
              <span className="font-medium">
                From $85
                <span className="font-normal text-muted-foreground">/hr</span>
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <StarIcon
                  className="size-3.5 fill-highlight text-highlight"
                  aria-hidden="true"
                />
                4.9 (128 reviews)
              </span>
            </div>
          </Card>

          <div className="absolute -bottom-5 -left-4 hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-lg sm:flex">
            <span className="flex size-8 items-center justify-center rounded-full bg-success/15 text-success">
              <CalendarCheckIcon className="size-4" aria-hidden="true" />
            </span>
            <div className="text-xs">
              <p className="font-medium">Booking confirmed</p>
              <p className="text-muted-foreground">Today · 2:00 PM</p>
            </div>
          </div>

          <div className="absolute -top-4 -right-3 hidden items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs shadow-lg sm:flex">
            <StarIcon
              className="size-4 fill-highlight text-highlight"
              aria-hidden="true"
            />
            <span className="font-medium">Top rated host</span>
          </div>
        </div>
      </div>
    </section>
  )
}
