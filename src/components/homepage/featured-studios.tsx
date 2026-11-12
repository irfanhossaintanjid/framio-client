"use client"

import Link from "next/link"
import {
  ArrowRightIcon,
  CameraIcon,
  ImageOffIcon,
  MapPinIcon,
  Maximize2Icon,
  StarIcon,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import type { Studio } from "@/lib/types/page"
import { SaveButton } from "@/components/studios/save-button"
import { ImageWithLoader } from "@/components/ui/image-with-loader"



type CategoryFilter = "all" | "photo" | "sound" | "podcast"

const categoryFilters: Array<{ label: string; value: CategoryFilter }> = [
  { label: "All Types", value: "all" },
  { label: "Photo Loft", value: "photo" },
  { label: "Sound Stage", value: "sound" },
  { label: "Podcast", value: "podcast" },
]



export function getStudioId(studio: Studio) {
  return typeof studio._id === "string" ? studio._id : studio._id.$oid
}

function getRating(studio: Studio) {
  const value = studio.rating ?? studio.averageRating ?? studio.avgRating
  if (value === undefined || value === null || value === "") return null

  const rating = Number(value)
  return Number.isFinite(rating) ? rating : null
}

function getCategoryLabel(category?: string) {
  if (!category) return "Studio"
  return category.replace(/\s+(studio|stage|lounge)$/i, "") || category
}

function matchesFilter(studio: Studio, filter: CategoryFilter) {
  if (filter === "all") return true

  const category = studio.category?.toLowerCase() ?? ""
  if (filter === "photo") {
    return category === "photo studio" || category === "daylight loft"
  }
  if (filter === "sound") return category === "film stage"
  return category === "podcast lounge"
}

function sortStudios(studios: Studio[]) {
  const hasRatings = studios.some((studio) => getRating(studio) !== null)
  return [...studios].sort((a, b) => {
    if (hasRatings) {
      return (getRating(b) ?? -1) - (getRating(a) ?? -1)
    }

    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
    return dateB - dateA
  })
}

function formatPrice(value?: string | number) {
  if (value === undefined || value === null || value === "") return "—"
  const price = Number(value)
  return Number.isFinite(price) ? `$${price.toLocaleString()}` : `$${value}`
}

function StudioImage({ studio }: { studio: Studio }) {
  const [hasError, setHasError] = useState(false)

  if (!studio.coverImageUrl || hasError) {
    return (
      <div className="flex size-full flex-col items-center justify-center gap-2 bg-secondary text-muted-foreground">
        {hasError ? (
          <ImageOffIcon className="size-7" aria-hidden="true" />
        ) : (
          <CameraIcon className="size-7" aria-hidden="true" />
        )}
        <span className="text-xs font-medium">Image unavailable</span>
      </div>
    )
  }

  return (
    <ImageWithLoader
      src={studio.coverImageUrl}
      alt={studio.title ? `${studio.title} studio` : "Studio cover image"}
      fill
      unoptimized
      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
      className="object-cover transition-transform duration-500 group-hover:scale-105"
      onError={() => setHasError(true)}
    />
  )
}

export function StudioCard({
  studio,
  onSavedChange,
}: {
  studio: Studio
  onSavedChange?: (saved: boolean) => void
}) {
  const rating = getRating(studio)
  const id = getStudioId(studio)

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        <StudioImage studio={studio} />
        <span className="absolute top-3 left-3 rounded-md bg-foreground/85 px-2 py-1 text-[0.625rem] font-bold tracking-wide text-background uppercase backdrop-blur-sm">
          {getCategoryLabel(studio.category)}
        </span>
        <SaveButton
          studioId={id}
          initialSaved={studio.isSaved}
          onSavedChange={onSavedChange}
        />
        {rating !== null ? (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 text-[0.6875rem] font-semibold text-foreground shadow-sm backdrop-blur-sm">
            <StarIcon className="size-3 fill-highlight text-highlight" aria-hidden="true" />
            {rating.toFixed(1)}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-3 text-[0.6875rem] text-muted-foreground">
          {studio.address ? (
            <span className="flex min-w-0 items-center gap-1 truncate">
              <MapPinIcon className="size-3 shrink-0 text-primary" aria-hidden="true" />
              {studio.address}
            </span>
          ) : null}
          {studio.squareFootage || studio.gearSummary ? (
            <span className="flex shrink-0 items-center gap-1">
              <Maximize2Icon className="size-3 text-primary" aria-hidden="true" />
              {studio.gearSummary ?? `${studio.squareFootage} sq ft`}
            </span>
          ) : null}
        </div>
        <h3 className="mt-2 line-clamp-1 text-base font-bold text-foreground">
          {studio.title || "Untitled Studio"}
        </h3>
        <p className="mt-1 line-clamp-2 min-h-9 text-xs leading-relaxed text-muted-foreground">
          {studio.description || studio.tagline || "A production-ready creative space for your next project."}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
          <p className="text-base font-bold text-primary">
            {formatPrice(studio.hourlyRate)}
            <span className="ml-0.5 text-[0.6875rem] font-medium text-muted-foreground">/hr</span>
          </p>
          <Link
            href={`/studios/${(id)}`}
            key={id}
            className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-[0.6875rem] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            View Details
            <ArrowRightIcon className="size-3" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}

export function StudioCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="aspect-[16/10] animate-pulse bg-secondary" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-2/3 animate-pulse rounded bg-secondary" />
        <div className="h-5 w-4/5 animate-pulse rounded bg-secondary" />
        <div className="h-8 animate-pulse rounded bg-secondary" />
        <div className="h-8 animate-pulse rounded bg-secondary" />
      </div>
    </div>
  )
}

export function FeaturedStudios() {
  const [studios, setStudios] = useState<Studio[]>([])
  const [selectedFilter, setSelectedFilter] = useState<CategoryFilter>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    async function loadStudios() {
      try {
        const response = await fetch("/api/studios?limit=6", {
          credentials: "include",
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`Unable to load studios (${response.status}).`)
        }

        const data: unknown = await response.json()
        if (!Array.isArray(data)) throw new Error("The studios response was invalid.")
        setStudios(sortStudios(data as Studio[]).slice(0, 6))
      } catch (loadError) {
        if (controller.signal.aborted) return
        setError(loadError instanceof Error ? loadError.message : "Unable to load studios.")
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    void loadStudios()
    return () => controller.abort()
  }, [])

  const visibleStudios = useMemo(
    () => studios.filter((studio) => matchesFilter(studio, selectedFilter)),
    [selectedFilter, studios],
  )

  return (
    <section
      id="featured-studios"
      aria-labelledby="featured-studios-heading"
      className="bg-background py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[0.6875rem] font-bold tracking-[0.14em] text-primary uppercase">
              <span className="size-1.5 rounded-full bg-highlight" aria-hidden="true" />
              Handpicked &amp; Production-Ready
            </p>
            <h2
              id="featured-studios-heading"
              className="mt-2.5 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Featured Studios 
            </h2>
          </div>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:max-w-[50%] md:justify-end">
            {categoryFilters.map(({ label, value }) => {
              const isSelected = selectedFilter === value
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedFilter(value)}
                  className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </header>

        {isLoading ? (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => <StudioCardSkeleton key={index} />)}
          </div>
        ) : error ? (
          <div className="mt-8 rounded-xl border border-destructive/30 bg-card px-5 py-8 text-center">
            <p className="text-sm font-semibold text-destructive">{error}</p>
            <p className="mt-1 text-xs text-muted-foreground">Please try again in a moment.</p>
          </div>
        ) : visibleStudios.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-border bg-card px-5 py-10 text-center">
            <p className="text-sm font-semibold text-foreground">No studios match this category yet.</p>
            <p className="mt-1 text-xs text-muted-foreground">Try another production type.</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleStudios.map((studio) => (
              <StudioCard key={getStudioId(studio)} studio={studio} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
