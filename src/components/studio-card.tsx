"use client"

import {
  ArrowUpRightIcon,
  BoltIcon,
  MapPinIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react"

import { StudioVisual } from "@/components/studio-visual"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Studio } from "@/lib/studios"

export function StudioCard({
  studio,
  onView,
}: {
  studio: Studio
  onView: (studio: Studio) => void
}) {
  return (
    <Card className="group/card gap-0 p-0 transition-colors duration-200 hover:bg-card-hover hover:ring-primary/25">
      <div className="relative">
        <StudioVisual
          discipline={studio.discipline}
          className="h-40 w-full transition-transform duration-500 group-hover/card:scale-[1.02]"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="backdrop-blur-sm">
            {studio.discipline}
          </Badge>
          {studio.featured ? <Badge variant="highlight">Featured</Badge> : null}
        </div>
        <Badge
          variant={studio.instant ? "success" : "warning"}
          className="absolute right-3 bottom-3 backdrop-blur-sm"
        >
          {studio.instant ? <BoltIcon aria-hidden="true" /> : null}
          {studio.instant ? "Instant book" : "Request to book"}
        </Badge>
      </div>

      <CardContent className="flex flex-col gap-3 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-heading text-base font-semibold">
              {studio.name}
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPinIcon className="size-3.5 shrink-0" aria-hidden="true" />
              {studio.location}
            </p>
          </div>
          <span className="flex shrink-0 items-center gap-1 text-sm font-medium">
            <StarIcon
              className="size-3.5 fill-highlight text-highlight"
              aria-hidden="true"
            />
            {studio.rating.toFixed(1)}
            <span className="font-normal text-muted-foreground">
              ({studio.reviews})
            </span>
          </span>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {studio.description}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <UsersIcon className="size-3.5" aria-hidden="true" />
            Up to {studio.capacity} people
          </span>
          <span className="flex items-center gap-1">
            <BoltIcon className="size-3.5" aria-hidden="true" />
            Replies {studio.responseTime}
          </span>
        </div>
      </CardContent>

      <CardFooter className="mt-4 flex items-center justify-between gap-3 bg-card/60">
        <div>
          <span className="font-heading text-lg font-semibold">
            ${studio.price}
          </span>
          <span className="text-sm text-muted-foreground"> / hour</span>
        </div>
        <Button
          size="sm"
          onClick={() => onView(studio)}
          aria-label={`View details for ${studio.name}`}
        >
          View studio
          <ArrowUpRightIcon aria-hidden="true" />
        </Button>
      </CardFooter>
    </Card>
  )
}
