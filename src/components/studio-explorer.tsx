"use client"

import * as React from "react"
import { RotateCcwIcon, SearchIcon, SearchXIcon } from "lucide-react"

import { StudioCard } from "@/components/studio-card"
import { StudioDetailsDialog } from "@/components/studio-details-dialog"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  locationOptions,
  sortOptions,
  studios,
  type Discipline,
  type Studio,
} from "@/lib/studios"

type DisciplineFilter = Discipline | "All"

const categoryOptions: DisciplineFilter[] = [
  "All",
  "Photography",
  "Music",
  "Film",
  "Design",
]

export function StudioExplorer() {
  const [query, setQuery] = React.useState("")
  const [discipline, setDiscipline] = React.useState<DisciplineFilter>("All")
  const [location, setLocation] = React.useState<string>("All locations")
  const [sort, setSort] = React.useState<string>("featured")
  const [selected, setSelected] = React.useState<Studio | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const results = React.useMemo(() => {
    const search = query.trim().toLowerCase()

    const filtered = studios.filter((studio) => {
      const matchesQuery =
        !search ||
        [studio.name, studio.location, studio.discipline, studio.description]
          .join(" ")
          .toLowerCase()
          .includes(search)
      const matchesDiscipline =
        discipline === "All" || studio.discipline === discipline
      const matchesLocation =
        location === "All locations" || studio.location === location

      return matchesQuery && matchesDiscipline && matchesLocation
    })

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "rating":
          return b.rating - a.rating || b.reviews - a.reviews
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        default:
          return (
            Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
            b.rating - a.rating
          )
      }
    })
  }, [query, discipline, location, sort])

  const hasFilters =
    query.trim() !== "" ||
    discipline !== "All" ||
    location !== "All locations" ||
    sort !== "featured"

  function resetFilters() {
    setQuery("")
    setDiscipline("All")
    setLocation("All locations")
    setSort("featured")
  }

  function viewStudio(studio: Studio) {
    setSelected(studio)
    setDialogOpen(true)
  }

  return (
    <section
      id="studios"
      className="scroll-mt-20 border-t border-border/70 bg-background py-16 sm:py-20"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-wide text-link uppercase">
              The marketplace
            </p>
            <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Find your next studio
            </h2>
            <p className="mt-2 text-muted-foreground">
              Search by craft, city, or vibe. Every listing is reviewed by the
              Framio team before it goes live.
            </p>
          </div>
          <p
            className="text-sm text-muted-foreground"
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="font-medium text-foreground">{results.length}</span>{" "}
            {results.length === 1 ? "studio" : "studios"} available
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-border bg-card p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <SearchIcon
                className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search studios, cities, or disciplines"
                className="h-9 pl-8"
                aria-label="Search studios"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Select
                value={location}
                onValueChange={(value) =>
                  setLocation((value as string) ?? "All locations")
                }
              >
                <SelectTrigger
                  className="h-9 w-full sm:w-44"
                  aria-label="Filter by location"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locationOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={sort}
                onValueChange={(value) =>
                  setSort((value as string) ?? "featured")
                }
              >
                <SelectTrigger
                  className="h-9 w-full sm:w-44"
                  aria-label="Sort studios"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasFilters ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-9"
                  onClick={resetFilters}
                >
                  <RotateCcwIcon aria-hidden="true" />
                  Reset
                </Button>
              ) : null}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-border/70 pt-3">
            {categoryOptions.map((option) => {
              const active = discipline === option
              return (
                <Button
                  key={option}
                  type="button"
                  size="xs"
                  variant={active ? "default" : "ghost"}
                  aria-pressed={active}
                  onClick={() => setDiscipline(option)}
                  className={
                    active
                      ? undefined
                      : "text-muted-foreground hover:text-foreground"
                  }
                >
                  {option === "All" ? "All disciplines" : option}
                </Button>
              )
            })}
          </div>
        </div>

        {results.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((studio) => (
              <StudioCard
                key={studio.id}
                studio={studio}
                onView={viewStudio}
              />
            ))}
          </div>
        ) : (
          <Empty className="mt-6 border border-dashed border-border bg-card py-14">
            <EmptyMedia variant="icon">
              <SearchXIcon aria-hidden="true" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>No studios match those filters</EmptyTitle>
              <EmptyDescription>
                Try a different city or discipline, or clear the filters to see
                every studio on Framio.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button type="button" variant="outline" onClick={resetFilters}>
                <RotateCcwIcon aria-hidden="true" />
                Clear all filters
              </Button>
            </EmptyContent>
          </Empty>
        )}
      </div>

      <StudioDetailsDialog
        studio={selected}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </section>
  )
}
