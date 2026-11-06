"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRightIcon,
  BadgeCheckIcon,
  Building2Icon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Clock3Icon,
  CopyIcon,
  HeartIcon,
  ImageOffIcon,
  InfoIcon,
  MailIcon,
  MapPinIcon,
  Maximize2Icon,
  Share2Icon,
  ShieldCheckIcon,
  StarIcon,
  UsersIcon,
  Volume2Icon,
  WifiIcon,
  XIcon,
  ZapIcon,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import {
  amenityGroups,
  cityFromAddress,
  formatMoney,
  galleryForStudio,
  numberValue,
  studioId,
  studioTypeLabel,
  type StudioDetails,
  type StudioReview,
} from "@/lib/studio-details";

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
const CLEANING_FEE_MULTIPLIER = 1;

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
      <Image
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

function HeaderActions({ studio: _studio }: { studio: StudioDetails }) {
  void _studio;
  const [saved, setSaved] = useState(false);
  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.add({
        title: "Link copied",
        description: "Studio link copied to your clipboard.",
        type: "success",
      });
    } catch {
      toast.add({
        title: "Unable to share",
        description: "Copy the page URL from your browser instead.",
        type: "error",
      });
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
      <button
        type="button"
        aria-pressed={saved}
        onClick={() => setSaved(!saved)}
        className="inline-flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-xs font-semibold text-foreground hover:bg-accent"
      >
        <HeartIcon
          className={`size-3.5 ${saved ? "fill-primary text-primary" : ""}`}
        />{" "}
        Save
      </button>
    </div>
  );
}

function HostCard({ studio }: { studio: StudioDetails }) {
  const name = studio.ownerName || "Framio Host";
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <section className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex min-w-0 items-center gap-3">
        {studio.ownerPhoto ? (
          <Image
            src={studio.ownerPhoto}
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
            Verified Framio host{" "}
            <BadgeCheckIcon className="ml-1 inline size-3.5 text-primary" />
          </p>
        </div>
      </div>
      {studio.ownerEmail ? (
        <a
          href={`mailto:${studio.ownerEmail}?subject=${encodeURIComponent(`Question about ${studio.title ?? "your studio"}`)}`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-xs font-semibold text-primary hover:bg-accent"
        >
          <MailIcon className="size-3.5" /> Contact Host
        </a>
      ) : null}
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

function BookingCard({ studio }: { studio: StudioDetails }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const minHours = Math.max(1, numberValue(studio.minimumDuration, 1));
  const rate = numberValue(studio.hourlyRate);
  const deposit = numberValue(studio.securityDeposit);
  const [tomorrow, setTomorrow] = useState("");
  const [date, setDate] = useState("");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState(`${String(9 + minHours).padStart(2, "0")}:00`);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const startHour = Number(start.slice(0, 2));
  const endHour = Number(end.slice(0, 2));
  const hours = Math.max(0, endHour - startHour);
  const cleaning = rate * CLEANING_FEE_MULTIPLIER;
  const total = rate * hours + cleaning;
  const owner = Boolean(
    session?.user?.email &&
    studio.ownerEmail &&
    session.user.email === studio.ownerEmail,
  );
  const times = Array.from({ length: 18 }, (_, index) => index + 6);
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const nextDay = new Date(Date.now() + 86400000)
        .toISOString()
        .slice(0, 10);
      setTomorrow(nextDay);
      setDate((current) => current || nextDay);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);
  const displayTime = (value: string) => {
    const hour = Number(value.slice(0, 2));
    return `${hour % 12 || 12}:00 ${hour >= 12 ? "PM" : "AM"}`;
  };
  async function beginBooking() {
    if (owner)
      return toast.add({
        title: "Your own listing",
        description: "You cannot book your own studio.",
        type: "info",
      });
    if (!session) {
      toast.add({
        title: "Please log in",
        description: "Please log in to book this space.",
        type: "info",
      });
      router.push(
        `/login?redirect=/studios/${encodeURIComponent(studioId(studio))}`,
      );
      return;
    }
    if (hours < minHours)
      return toast.add({
        title: "Choose a longer booking",
        description: `This studio requires at least ${minHours} hours.`,
        type: "error",
      });
    setOpen(true);
  }
  async function confirmBooking() {
    setSubmitting(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          studioId: studioId(studio),
          date,
          startTime: start,
          endTime: end,
        }),
      });
      if (response.status === 409)
        throw new Error(
          (await response.json().catch(() => null))?.message ??
            "This time slot is already booked.",
        );
      if (response.status === 401) {
        toast.add({
          title: "Session expired",
          description: "Please log in again.",
          type: "error",
        });
        router.push(
          `/login?redirect=/studios/${encodeURIComponent(studioId(studio))}`,
        );
        return;
      }
      if (!response.ok) throw new Error(await response.text());
      toast.add({
        title: "Booking request sent!",
        description: "The host will review your production request.",
        type: "success",
      });
      setOpen(false);
      router.push("/my-bookings");
    } catch (error) {
      toast.add({
        title: "Booking failed",
        description:
          error instanceof Error ? error.message : "Please try again.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <>
      <section
        id="booking-card"
        className="rounded-2xl border border-border bg-card p-5 shadow-lg lg:sticky lg:top-24"
      >
        <div className="flex items-end justify-between">
          <p className="text-3xl font-bold text-foreground">
            {formatMoney(rate)}
            <span className="text-sm font-medium text-muted-foreground">
              {" "}
              / hour
            </span>
          </p>
          <span className="rounded-full bg-secondary px-2 py-1 text-[0.625rem] font-semibold text-primary">
            {minHours} hrs min booking
          </span>
        </div>
        <div className="mt-5 space-y-4">
          <label className="block text-xs font-semibold text-foreground">
            Production Date
            <input
              type="date"
              min={tomorrow}
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs font-semibold text-foreground">
              Call Time (Start)
              <select
                value={start}
                onChange={(event) => {
                  const next = event.target.value;
                  setStart(next);
                  if (
                    Number(end.slice(0, 2)) <
                    Number(next.slice(0, 2)) + minHours
                  )
                    setEnd(
                      `${String(Number(next.slice(0, 2)) + minHours).padStart(2, "0")}:00`,
                    );
                }}
                className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-2 text-sm"
              >
                <option disabled>Choose start</option>
                {times.map((hour) => (
                  <option
                    key={hour}
                    value={`${String(hour).padStart(2, "0")}:00`}
                  >
                    {displayTime(`${String(hour).padStart(2, "0")}:00`)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-semibold text-foreground">
              Wrap Time (End)
              <select
                value={end}
                onChange={(event) => setEnd(event.target.value)}
                className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-2 text-sm"
              >
                {times
                  .filter((hour) => hour > Number(start.slice(0, 2)))
                  .map((hour) => (
                    <option
                      key={hour}
                      value={`${String(hour).padStart(2, "0")}:00`}
                    >
                      {displayTime(`${String(hour).padStart(2, "0")}:00`)}
                    </option>
                  ))}
              </select>
            </label>
          </div>
          {hours < minHours ? (
            <p className="text-xs text-destructive">
              Wrap time must be at least {minHours} hours after call time.
            </p>
          ) : null}
          <div className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2 text-xs">
            <span>
              <Clock3Icon className="mr-1 inline size-3" /> Total Reserved
              Duration
            </span>
            <strong>{hours} Hours Production Hold</strong>
          </div>
          <div className="space-y-2 border-t border-border pt-3 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>
                {formatMoney(rate)} × {hours} hrs
              </span>
              <span>{formatMoney(rate * hours)}</span>
            </div>
            <div className="flex justify-between">
              <span>Standard Post-Shoot Cleaning</span>
              <span>{formatMoney(cleaning)}</span>
            </div>
            <div className="flex justify-between">
              <span>
                Security Deposit (Escrow) <InfoIcon className="inline size-3" />
              </span>
              <span>{formatMoney(deposit)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-sm font-bold text-foreground">
              <span>Total Estimated</span>
              <span>{formatMoney(total)}</span>
            </div>
            <p className="text-right text-[0.625rem]">
              + {formatMoney(deposit)} refundable escrow
            </p>
          </div>
          <button
            type="button"
            disabled={owner || hours < minHours}
            onClick={() => void beginBooking()}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-bold text-primary-foreground hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {owner ? "Your Own Listing" : "Book Workspace Now"}
            <ArrowRightIcon className="size-4" />
          </button>
          <p className="text-center text-[0.625rem] text-muted-foreground">
            You won&apos;t be charged yet. Instant confirmation upon host
            availability.
          </p>
          <div className="flex justify-center gap-3 text-[0.625rem] font-semibold text-muted-foreground">
            <span>◉ Free cancellation (48h)</span>
            <span>◉ $1M Insurance</span>
          </div>
        </div>
      </section>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-dialog-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 id="booking-dialog-title" className="text-lg font-bold">
                Confirm your booking
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close booking dialog"
              >
                <XIcon className="size-5" />
              </button>
            </div>
            <p className="mt-4 text-sm font-semibold">{studio.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {date} · {displayTime(start)} – {displayTime(end)} · {hours} hours
            </p>
            <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <span>Production hold</span>
                <span>{formatMoney(rate * hours)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cleaning</span>
                <span>{formatMoney(cleaning)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatMoney(total)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatMoney(deposit)} refundable escrow is held separately.
              </p>
            </div>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-10 flex-1 rounded-lg bg-secondary text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => void confirmBooking()}
                className="h-10 flex-1 rounded-lg bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                {submitting ? "Sending…" : "Confirm Request"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function Reviews({ studio }: { studio: StudioDetails }) {
  const { data: session } = authClient.useSession();
  const [reviews, setReviews] = useState<StudioReview[]>([]);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetch(
      `${apiBaseUrl}/api/studios/${encodeURIComponent(studioId(studio))}/reviews`,
      { signal: controller.signal },
    )
      .then((response) => (response.ok ? response.json() : []))
      .then((data: unknown) => {
        if (Array.isArray(data)) setReviews(data as StudioReview[]);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [studio]);
  async function submitReview() {
    if (!session) {
      toast.add({
        title: "Please log in",
        description: "Log in to write a review.",
        type: "info",
      });
      return;
    }
    if (!comment.trim())
      return toast.add({
        title: "Add a comment",
        description: "Tell other creators about your experience.",
        type: "error",
      });
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/studios/${encodeURIComponent(studioId(studio))}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ rating, comment }),
        },
      );
      if (!response.ok) throw new Error(await response.text());
      toast.add({
        title: "Review submitted",
        description: "Thanks for sharing your experience.",
        type: "success",
      });
      setOpen(false);
      setComment("");
    } catch (error) {
      toast.add({
        title: "Review unavailable",
        description:
          error instanceof Error ? error.message : "Please try again later.",
        type: "error",
      });
    }
  }
  const average = numberValue(
    studio.rating,
    reviews.length
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0,
  );
  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Production Reviews{" "}
            <span className="ml-1 rounded-full bg-secondary px-2 py-1 text-xs text-primary">
              {average ? `${average.toFixed(2)} ★` : "New"}
            </span>
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {reviews.length
              ? `Evaluated by ${reviews.length} verified creators`
              : "No reviews yet. Be the first to share your experience."}
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            session
              ? setOpen(true)
              : toast.add({
                  title: "Please log in",
                  description: "Log in to write a review.",
                  type: "info",
                })
          }
          className="rounded-lg bg-secondary px-3 py-2 text-xs font-semibold text-primary"
        >
          Write a Review
        </button>
      </div>
      {reviews.length ? (
        <div className="mt-4 space-y-3">
          {reviews.map((review, index) => (
            <article
              key={review._id ?? index}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">
                  {review.userName ?? "Verified Creator"}
                </p>
                <span className="text-xs text-highlight">
                  {"★".repeat(Math.max(1, Math.min(5, review.rating)))}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {review.comment}
              </p>
            </article>
          ))}
        </div>
      ) : null}
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl bg-card p-5">
            <div className="flex justify-between">
              <h3 className="font-bold">Write a review</h3>
              <button type="button" onClick={() => setOpen(false)}>
                <XIcon className="size-5" />
              </button>
            </div>
            <div className="mt-4 flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  aria-label={`${value} stars`}
                >
                  <StarIcon
                    className={`size-6 ${value <= rating ? "fill-highlight text-highlight" : "text-muted-foreground"}`}
                  />
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              className="mt-4 min-h-32 w-full rounded-lg border border-border bg-background p-3 text-sm"
              placeholder="How was the space?"
            />
            <button
              type="button"
              onClick={() => void submitReview()}
              className="mt-4 h-10 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground"
            >
              Submit Review
            </button>
          </div>
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
