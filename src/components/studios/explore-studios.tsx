"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CameraIcon,
  ChevronDownIcon,
  ClapperboardIcon,
  Mic2Icon,
  Music2Icon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";
import {
  StudioCard,
} from "@/components/homepage/featured-studios";
import type {Studio} from "@/lib/types/page";



type FilterKey = "all" | "photo" | "film" | "podcast" | "music" | "workshop";
type SortKey = "rating" | "price-low" | "price-high" | "newest";

const filters: Array<{ label: string; key: FilterKey; icon: LucideIcon }> = [
  { label: "All Studios", key: "all", icon: CameraIcon },
  { label: "Photo Studios", key: "photo", icon: CameraIcon },
  { label: "Film Stages", key: "film", icon: ClapperboardIcon },
  { label: "Podcast Rooms", key: "podcast", icon: Mic2Icon },
  { label: "Music Suites", key: "music", icon: Music2Icon },
  { label: "Workshops", key: "workshop", icon: UsersIcon },
];

const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
).replace(/\/+$/, "");

function ratingOf(studio: Studio) {
  const value = studio.rating ?? studio.averageRating ?? studio.avgRating;
  const rating = Number(value);
  return Number.isFinite(rating) ? rating : 0;
}

function priceOf(studio: Studio) {
  const price = Number(studio.hourlyRate);
  return Number.isFinite(price) ? price : Number.MAX_SAFE_INTEGER;
}

function matchesFilter(studio: Studio, filter: FilterKey) {
  if (filter === "all") return true;
  const category = studio.category?.toLowerCase() ?? "";
  if (filter === "photo")
    return category === "photo studio" || category === "daylight loft";
  if (filter === "film") return category === "film stage";
  if (filter === "podcast") return category === "podcast lounge";
  if (filter === "music") return category === "music suite";
  return (
    category === "art workshop" ||
    category === "warehouse" ||
    category === "other stage"
  );
}

function gearSummary(studio: Studio) {
  const category = studio.category?.toLowerCase();
  if (category === "podcast lounge") return "4 Mics + 3 Cams";
  if (category === "music suite") return "SSL Console";
  return undefined;
}

function sortStudios(studios: Studio[], sort: SortKey) {
  return [...studios].sort((a, b) => {
    if (sort === "rating") return ratingOf(b) - ratingOf(a);
    if (sort === "price-low") return priceOf(a) - priceOf(b);
    if (sort === "price-high") return priceOf(b) - priceOf(a);
    return (
      new Date(String(b.createdAt ?? 0)).getTime() -
      new Date(String(a.createdAt ?? 0)).getTime()
    );
  });
}

function GridSkeleton() {
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
  );
}

export function ExploreStudios() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  const initialFilter = initialCategory?.includes("photo")
    ? "photo"
    : initialCategory?.includes("sound") || initialCategory?.includes("film")
      ? "film"
      : initialCategory?.includes("podcast")
        ? "podcast"
        : initialCategory?.includes("music")
          ? "music"
          : initialCategory?.includes("workshop") ||
              initialCategory?.includes("art")
            ? "workshop"
            : "all";
  const [studios, setStudios] = useState<Studio[]>([]);
  const [filter, setFilter] = useState<FilterKey>(initialFilter);
  const [sort, setSort] = useState<SortKey>("rating");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    async function loadStudios() {
      try {
        const response = await fetch(`${apiBaseUrl}/allStudios`, {
          credentials: "omit",
          signal: controller.signal,
        });
        if (!response.ok)
          throw new Error(`Unable to load studios (${response.status}).`);
        const data: unknown = await response.json();
        if (!Array.isArray(data))
          throw new Error("The studios response was invalid.");
        setStudios(data as Studio[]);
      } catch (loadError) {
        if (!controller.signal.aborted)
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load studios.",
          );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }
    void loadStudios();
    return () => controller.abort();
  }, []);

  const visibleStudios = useMemo(
    () =>
      sortStudios(
        studios
          .filter((studio) => matchesFilter(studio, filter))
          .map((studio) => ({ ...studio, gearSummary: gearSummary(studio) })),
        sort,
      ),
    [filter, sort, studios],
  );

  function clearFilters() {
    setFilter("all");
    setSort("rating");
  }

  return (
    <main className="min-h-dvh bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="border-t border-border/70 pt-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map(({ label, key, icon: Icon }) => {
              const active = filter === key;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(key)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 ${active ? "bg-foreground text-background" : "bg-secondary text-foreground hover:bg-accent"}`}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </button>
              );
            })}
          </div>
          <div className="mt-8 flex items-center gap-2 border-b border-border pb-3 text-sm">
            <span className="text-muted-foreground">Sort by:</span>
            <div className="relative">
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="h-8 appearance-none rounded-lg bg-secondary py-1 pl-3 pr-8 font-semibold text-primary outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="rating">Top Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
              <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>
        <header className="py-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Creative Studios for Rent
          </h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <span
              className="size-2 rounded-full bg-emerald-500"
              aria-hidden="true"
            />
            Showing{" "}
            <strong className="text-foreground">
              {visibleStudios.length} studios
            </strong>
          </p>
        </header>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 20 }, (_, index) => (
              <GridSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-destructive/30 bg-card px-6 py-12 text-center">
            <h2 className="text-lg font-bold text-destructive">
              Unable to load studios
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          </div>
        ) : visibleStudios.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <h2 className="text-xl font-bold">No Studios Match Your Search</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a different category, location, or price range.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleStudios.map((studio) => (
              <StudioCard
                key={
                  typeof studio._id === "string" ? studio._id : studio._id.$oid
                }
                studio={studio}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
