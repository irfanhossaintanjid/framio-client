"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  BadgeCheckIcon,
  Building2Icon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Clock3Icon,
  CopyIcon,
  ImageOffIcon,
  MapPinIcon,
  Maximize2Icon,
  Share2Icon,
  ShieldCheckIcon,
  StarIcon,
  UsersIcon,
  Volume2Icon,
  WifiIcon,
  ZapIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import { ToastMessage } from "@/components/toast-message";
import { BookingCard } from "@/components/booking/bookingCard";
import { SaveButton } from "@/components/studios/save-button";
import { ImageWithLoader } from "@/components/ui/image-with-loader";
import {
  amenityGroups,
  cityFromAddress,
  formatMoney,
  galleryForStudio,
  numberValue,
  studioId,
  studioTypeLabel,
} from "@/lib/studio-details";

import type {StudioDetails} from "@/lib/types/page"

function ImageFallback({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex size-full items-center justify-center bg-secondary text-muted-foreground ${className}`}
    >
      <ImageOffIcon className="size-8" aria-hidden="true" />
    </div>
  );
}

function Gallery({ studio }: { studio: StudioDetails }) {
  const images = galleryForStudio(studio);
  const [index, setIndex] = useState(0);
  const [broken, setBroken] = useState(false);
  if (!images.length || broken)
    return (
      <div className="aspect-[16/9] overflow-hidden rounded-2xl">
        <ImageFallback />
      </div>
    );
  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-secondary">
      <ImageWithLoader
        src={images[index]}
        alt={studio.title ? `${studio.title} studio` : "Studio photo"}
        fill
        unoptimized
        sizes="(max-width: 1024px) 100vw, 66vw"
        className="object-cover"
        onError={() => setBroken(true)}
      />
      {images.length > 1 ? (
        <>
          <button
            type="button"
            aria-label="Previous studio image"
            onClick={() =>
              setIndex((index - 1 + images.length) % images.length)
            }
            className="absolute top-1/2 left-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm hover:bg-background"
          >
            <ChevronLeftIcon className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next studio image"
            onClick={() => setIndex((index + 1) % images.length)}
            className="absolute top-1/2 right-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm hover:bg-background"
          >
            <ChevronRightIcon className="size-4" />
          </button>
          <div
            className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5"
            aria-label="Gallery pagination"
          >
            {images.map((image, imageIndex) => (
              <button
                key={`${image}-${imageIndex}`}
                type="button"
                aria-label={`Show image ${imageIndex + 1}`}
                onClick={() => setIndex(imageIndex)}
                className={`size-1.5 rounded-full ${imageIndex === index ? "bg-white" : "bg-white/50"}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

function HeaderActions({ studio }: { studio: StudioDetails }) {
  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(<ToastMessage title="Link copied" description="Studio link copied to your clipboard." />);
    } catch {
      toast.error(<ToastMessage title="Unable to share" description="Copy the page URL from your browser instead." />);
    }
  }
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => void share()}
        className="inline-flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-xs font-semibold text-foreground hover:bg-accent"
      >
        <Share2Icon className="size-3.5" /> Share
      </button>
      <SaveButton
        studioId={studioId(studio)}
        initialSaved={studio.isSaved}
        variant="inline"
        showLabel
      />
    </div>
  );
}

function HostCard({ studio }: { studio: StudioDetails }) {
  const name = studio.ownerName || "Framio Host";
  const initials = name
    .split(/\s+/)
    .map((part: string) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <section className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex min-w-0 items-center gap-3">
        {studio.ownerImage ? (
          <Image
            src={studio.ownerImage}
            alt={name}
            width={48}
            height={48}
            unoptimized
            className="size-12 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-primary">
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-foreground">
            Hosted by {name}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {studio.ownerEmail}
            <BadgeCheckIcon className="ml-1 inline size-3.5 text-primary" />
          </p>
        </div>
      </div>
      
    </section>
  );
}

function SpecGrid({ studio }: { studio: StudioDetails }) {
  const specs = [
    [
      UsersIcon,
      "Capacity",
      studio.crewCapacity
        ? `Up to ${numberValue(studio.crewCapacity)} Crew`
        : "Not specified",
    ],
    [
      Maximize2Icon,
      "Floor Space",
      studio.squareFootage
        ? `${numberValue(studio.squareFootage).toLocaleString()} sq. ft.`
        : "Not specified",
    ],
    [
      Clock3Icon,
      "Minimum Booking",
      `${numberValue(studio.minimumDuration, 1)} Hour${numberValue(studio.minimumDuration, 1) === 1 ? "" : "s"} Minimum`,
    ],
    [CopyIcon, "Hourly Rate", `${formatMoney(studio.hourlyRate)} / hr`],
    [
      ShieldCheckIcon,
      "Security Deposit",
      studio.securityDeposit
        ? `${formatMoney(studio.securityDeposit)} (Escrow)`
        : "Not specified",
    ],
    [CameraIcon, "Studio Type", studioTypeLabel(studio.category)],
  ] as const;
  return (
    <section>
      <h2 className="text-lg font-bold text-foreground">
        Studio Specifications
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {specs.map(([Icon, label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-border bg-card p-3"
          >
            <Icon className="size-4 text-primary" />
            <p className="mt-2 text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 text-xs font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CameraIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={props.className}
    >
      <path d="M14.5 4h-5L8 6H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3l-1.5-2Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function Amenities({ studio }: { studio: StudioDetails }) {
  const selected = new Set(studio.amenities ?? []);
  const icons = {
    zap: ZapIcon,
    building: Building2Icon,
    volume: Volume2Icon,
    wifi: WifiIcon,
  };
  const groups = amenityGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => selected.has(item)),
    }))
    .filter((group) => group.items.length);
  if (!groups.length) return null;
  return (
    <section>
      <h2 className="text-lg font-bold text-foreground">
        Included Production Gear &amp; Amenities
      </h2>
      <div className="mt-3 space-y-3">
        {groups.map((group) => {
          const Icon = icons[group.icon];
          return (
            <div
              key={group.title}
              className="rounded-xl border border-border bg-card p-4"
            >
              <h3 className="flex items-center gap-2 text-xs font-bold text-foreground">
                <Icon className="size-4 text-primary" /> {group.title}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[0.6875rem] text-foreground"
                  >
                    <CheckIcon className="size-3 text-primary" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Reviews({ studio }: { studio: StudioDetails }) {
  const reviews = studio.reviews ?? [];
  const average = reviews.length
    ? reviews.reduce((total, review) => total + numberValue(review.rating), 0) /
      reviews.length
    : numberValue(studio.rating);

  function formatDate(value?: string) {
    if (!value) return "";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? ""
      : new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }).format(date);
  }

  return (
    <section aria-labelledby="studio-reviews-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="studio-reviews-heading" className="text-lg font-bold">
            Production Reviews
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {reviews.length
              ? `Evaluated by ${reviews.length} verified creator${reviews.length === 1 ? "" : "s"}`
              : "No reviews yet for this studio."}
          </p>
        </div>
        {reviews.length ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-primary">
            <StarIcon className="size-3 fill-highlight text-highlight" aria-hidden="true" />
            {average.toFixed(2)}
          </span>
        ) : null}
      </div>

      {reviews.length ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {reviews.map((review, index) => {
            const name = review.userName || "Verified creator";
            const initials = name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <article
                key={review._id ?? `${name}-${review.createdAt ?? index}`}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-center gap-3">
                  {review.userPhoto ? (
                    <Image
                      src={review.userPhoto}
                      alt={`${name} profile`}
                      width={36}
                      height={36}
                      unoptimized
                      className="size-9 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-xs font-bold text-primary">
                      {initials}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{name}</p>
                    <p className="text-[0.6875rem] text-muted-foreground">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                  <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-foreground">
                    <StarIcon className="size-3 fill-highlight text-highlight" aria-hidden="true" />
                    {numberValue(review.rating).toFixed(1)}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {review.comment}
                </p>
              </article>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}




export function StudioDetailsClient({ studio }: { studio: StudioDetails }) {
  const rating = numberValue(studio.rating);
  const city = cityFromAddress(studio.address);
  const [expanded, setExpanded] = useState(false);
  return (
    <main className="min-h-dvh bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <nav className="flex flex-wrap items-center gap-1.5 text-[0.6875rem] text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link href="/studios" className="hover:text-primary">
            Explore Studios
          </Link>
          <span>/</span>
          <span>{city}</span>
          <span>/</span>
          <span className="truncate text-foreground">{studio.title}</span>
        </nav>
        <header className="mt-5 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-secondary px-2.5 py-1 text-[0.625rem] font-bold text-primary uppercase">
                {studio.category ?? "Studio"}
              </span>
              <span className="rounded-full bg-secondary px-2.5 py-1 text-[0.625rem] font-semibold text-primary">
                ⚡ Instant Book
              </span>
              <span className="rounded-full bg-secondary px-2.5 py-1 text-[0.625rem] font-semibold text-primary">
                $1M Production Coverage
              </span>
              {rating >= 4.9 ? (
                <span className="rounded-full bg-secondary px-2.5 py-1 text-[0.625rem] font-semibold text-primary">
                  Superhost
                </span>
              ) : null}
            </div>
            <HeaderActions studio={studio} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {studio.title ?? "Creative Studio"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {studio.tagline ?? "An inspiring space for your next production."}
          </p>
          <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <StarIcon className="size-3.5 fill-highlight text-highlight" />
            {rating ? rating.toFixed(2) : "New"}
            <span>•</span>
            <MapPinIcon className="size-3.5 text-primary" />
            {studio.address ?? city}
          </p>
        </header>
        <div className="mt-6">
          <Gallery studio={studio} />
        </div>
        <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
          <div className="min-w-0 space-y-8">
            <HostCard studio={studio} />
            <SpecGrid studio={studio} />
            <section>
              <h2 className="text-lg font-bold">About This Space</h2>
              <div
                className={`mt-3 text-sm leading-relaxed text-muted-foreground ${expanded ? "" : "line-clamp-4"}`}
              >
                {(
                  studio.description ??
                  "This production-ready space is designed for creative teams, makers, and storytellers."
                )
                  .split(/\n+/)
                  .map((paragraph) => (
                    <p key={paragraph} className="mb-3">
                      {paragraph}
                    </p>
                  ))}
              </div>
              {(studio.description?.length ?? 0) > 420 ? (
                <button
                  type="button"
                  onClick={() => setExpanded(!expanded)}
                  className="text-xs font-semibold text-primary"
                >
                  {expanded ? "Show less" : "Read more production details"}{" "}
                  <ChevronDownIcon
                    className={`ml-1 inline size-3 transition-transform ${expanded ? "rotate-180" : ""}`}
                  />
                </button>
              ) : null}
            </section>
            <Amenities studio={studio} />
            <section>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">Location &amp; Access</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {studio.address ?? "Address shared after booking"}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Exact unit details are shared after booking confirmation
                </p>
              </div>
              {studio.address ? (
                <iframe
                  title="Studio location map"
                  loading="lazy"
                  className="mt-4 h-56 w-full rounded-xl border border-border"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(studio.address)}&output=embed`}
                />
              ) : null}
            </section>
            <Reviews studio={studio} />
          </div>
          <BookingCard studio={studio} />
        </div>
      </div>
    </main>
  );
}
