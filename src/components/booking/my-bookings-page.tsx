"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDaysIcon,
  CalendarIcon,
  ChevronDownIcon,
  Clock3Icon,
  MapPinIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import type { StudioDetails } from "@/lib/types/page";

const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
).replace(/\/+$/, "");

type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";
type BookingFilter = "All Bookings" | BookingStatus;

type Booking = {
  _id: string;
  bookingReference?: string;
  studioId: string;
  date: string;
  startTime: string;
  endTime: string;
  durationHours?: number;
  hourlyRate?: number | string;
  securityDeposit?: number | string;
  totalAmount?: number | string;
  title?: string;
  coverImageUrl?: string;
  category?: string;
  address?: string;
  status: BookingStatus;
  createdAt?: string;
  studio?: StudioDetails | null;
};

const filters: BookingFilter[] = [
  "All Bookings",
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
];

function formatMoney(value?: number | string) {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount)
    ? `$${amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
    : "$0";
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

function formatCreatedDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

function formatTime(value?: string) {
  if (!value) return "—";
  const [hourText, minute = "00"] = value.split(":");
  const hour = Number(hourText);
  if (!Number.isFinite(hour)) return value;
  return `${hour % 12 || 12}:${minute} ${hour >= 12 ? "PM" : "AM"}`;
}

function durationOf(booking: Booking) {
  if (booking.durationHours) return booking.durationHours;
  const start = Number(booking.startTime?.slice(0, 2));
  const end = Number(booking.endTime?.slice(0, 2));
  return Math.max(0, end - start);
}

function studioIdOf(studio?: StudioDetails | null) {
  if (!studio?._id) return "";
  return typeof studio._id === "string" ? studio._id : studio._id.$oid;
}

function statusClass(status: BookingStatus) {
  if (status === "Pending")
    return "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300";
  if (status === "Confirmed")
    return "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300";
  if (status === "Completed")
    return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300";
  return "bg-secondary text-muted-foreground";
}

function BookingSkeleton() {
  return (
    <div className="grid animate-pulse gap-4 rounded-xl border border-border bg-card p-4 lg:grid-cols-[minmax(210px,1.1fr)_minmax(300px,1.7fr)_150px]">
      <div className="h-28 rounded-lg bg-secondary" />
      <div className="space-y-3">
        <div className="h-4 w-2/3 rounded bg-secondary" />
        <div className="h-3 w-full rounded bg-secondary" />
        <div className="h-10 w-full rounded bg-secondary" />
      </div>
      <div className="h-20 rounded bg-secondary" />
    </div>
  );
}

function StudioThumb({ studio }: { studio?: StudioDetails | null }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-secondary sm:w-36 sm:shrink-0 lg:w-full">
      <Image
        src={studio?.coverImageUrl ?? "/images/hero/daylight-studio.jpg"}
        alt={studio?.title ? `${studio.title} cover` : "Studio cover"}
        fill
        unoptimized
        sizes="(max-width: 639px) 100vw, 144px"
        className="object-cover"
      />
      <span className="absolute bottom-2 left-2 rounded bg-foreground/85 px-1.5 py-0.5 text-[0.5625rem] font-bold tracking-wide text-background uppercase">
        {studio?.category ?? "Studio"}
      </span>
    </div>
  );
}

function BookingRow({
  booking,
  onDetails,
  onCancel,
}: {
  booking: Booking;
  onDetails: () => void;
  onCancel: () => void;
}) {
  const studio = booking.studio;
  const duration = durationOf(booking);
  const studioId = studioIdOf(studio);
  const reference =
    booking.bookingReference ?? `BK-${booking._id.slice(-6).toUpperCase()}`;

  return (
    <article className="grid gap-4 rounded-xl border border-border bg-card p-3.5 shadow-sm transition-shadow hover:shadow-md sm:p-4 lg:grid-cols-[minmax(210px,1.1fr)_minmax(300px,1.7fr)_150px] lg:items-center">
      <div className="flex min-w-0 gap-3">
        <StudioThumb studio={studio} />
        <div className="min-w-0 sm:hidden">
          <p className="text-[0.625rem] font-semibold text-primary">
            #{reference}
          </p>
          <h2 className="mt-1 truncate text-sm font-bold text-foreground">
            {studio?.title ?? "Studio unavailable"}
          </h2>
          <p className="mt-1 flex items-center gap-1 truncate text-[0.6875rem] text-muted-foreground">
            <MapPinIcon className="size-3 shrink-0 text-primary" />
            {studio?.address ?? "Location unavailable"}
          </p>
          {studioId ? (
            <Link
              href={`/studios/${studioId}`}
              className="p-2 inline-block text-[0.6875rem] rounded-md font-semibold text-primary hover:underline hover:bg-sidebar-border"
            >
              View Studio →
            </Link>
          ) : null}
        </div>
        <div className="hidden min-w-0 sm:block lg:hidden">
          <p className="text-[0.625rem] font-semibold text-primary">
            #{reference}
          </p>
          <h2 className="mt-1 truncate text-sm font-bold text-foreground">
            {studio?.title ?? "Studio unavailable"}
          </h2>
          <p className="mt-1 flex items-center gap-1 truncate text-xs text-muted-foreground">
            <MapPinIcon className="size-3 text-primary" />
            {studio?.address ?? "Location unavailable"}
          </p>
          {studioId ? (
            <Link
              href={`/studios/${studioId}`}
              className="p-2  inline-block rounded-md text-xs font-semibold text-primary hover:underline hover:bg-sidebar-border"
            >
              View Studio →
            </Link>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-3 text-xs sm:grid-cols-4 sm:border-t-0 sm:pt-0">
        <div>
          <p className="flex items-center gap-1 text-muted-foreground">
            <CalendarIcon className="size-3" /> Date
          </p>
          <p className="mt-1 font-semibold">{formatDate(booking.date)}</p>
        </div>
        <div>
          <p className="flex items-center gap-1 text-muted-foreground">
            <Clock3Icon className="size-3" /> Time
          </p>
          <p className="mt-1 font-semibold">
            {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Duration</p>
          <p className="mt-1 font-semibold">
            {duration} hour{duration === 1 ? "" : "s"}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Hourly Rate</p>
          <p className="mt-1 font-semibold">
            {formatMoney(booking.hourlyRate ?? studio?.hourlyRate)}/hr
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Deposit</p>
          <p className="mt-1 font-semibold">
            {formatMoney(booking.securityDeposit ?? studio?.securityDeposit)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Total Amount</p>
          <p className="mt-1 text-base font-bold text-primary">
            {formatMoney(
              booking.totalAmount ??
                Number(booking.hourlyRate ?? studio?.hourlyRate ?? 0) *
                  duration,
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border pt-3 lg:h-full lg:flex-col lg:items-end lg:justify-center lg:border-t-0 lg:border-l lg:pl-4 lg:pt-0">
        <span
          className={`rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold ${statusClass(booking.status)}`}
        >
          {booking.status}
        </span>
        <div className="flex flex-wrap justify-end gap-2">
         
          {booking.status === "Pending" ? (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-destructive/40 px-3 py-1.5 text-[0.6875rem] font-semibold text-destructive hover:bg-destructive/5"
            >
              Cancel Booking
            </button>
          ) : null}
          {(booking.status === "Completed" || booking.status === "Cancelled") &&
          studioId ? (
            <Link
              href={`/studios/${studioId}`}
              className="rounded-md bg-primary px-3 py-1.5 text-[0.6875rem] font-semibold text-primary-foreground hover:bg-primary-hover"
            >
              Book Again
            </Link>
          ) : null}
        
        </div>
      </div>
    </article>
  );
}

function BookingDetailsModal({
  booking,
  onClose,
  onCancel,
}: {
  booking: Booking;
  onClose: () => void;
  onCancel: () => void;
}) {
  const studio = booking.studio;
  const studioId = studioIdOf(studio);
  const duration = durationOf(booking);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-details-title"
    >
      <div className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-primary">
              #{booking.bookingReference ?? booking._id}
            </p>
            <h2 id="booking-details-title" className="mt-1 text-xl font-bold">
              Booking Details
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking details"
            className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <XIcon className="size-5" />
          </button>
        </div>
        <div className="mt-4 flex gap-3">
          <StudioThumb studio={studio} />
          <div className="min-w-0">
            <h3 className="truncate font-bold">
              {studio?.title ?? "Studio unavailable"}
            </h3>
            <p className="mt-1 flex items-start gap-1 text-xs text-muted-foreground">
              <MapPinIcon className="mt-0.5 size-3 shrink-0 text-primary" />
              {studio?.address ?? "Location unavailable"}
            </p>
            <span
              className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold ${statusClass(booking.status)}`}
            >
              {booking.status}
            </span>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-secondary p-3 text-xs">
          <div>
            <p className="text-muted-foreground">Date</p>
            <p className="mt-1 font-semibold">{formatDate(booking.date)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Time</p>
            <p className="mt-1 font-semibold">
              {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Duration</p>
            <p className="mt-1 font-semibold">{duration} hours</p>
          </div>
          <div>
            <p className="text-muted-foreground">Hourly Rate</p>
            <p className="mt-1 font-semibold">
              {formatMoney(booking.hourlyRate ?? studio?.hourlyRate)}/hr
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Security Deposit</p>
            <p className="mt-1 font-semibold">
              {formatMoney(booking.securityDeposit ?? studio?.securityDeposit)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Amount</p>
            <p className="mt-1 text-base font-bold text-primary">
              {formatMoney(booking.totalAmount)}
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Created {formatCreatedDate(booking.createdAt)}
        </p>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-secondary px-4 py-2 text-xs font-semibold"
          >
            Close
          </button>
          {booking.status === "Pending" ? (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-destructive/40 px-4 py-2 text-xs font-semibold text-destructive"
            >
              Cancel Booking
            </button>
          ) : null}
          {studioId ? (
            <Link
              href={`/studios/${studioId}`}
              onClick={onClose}
              className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover"
            >
              View Studio
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function MyBookingsPage() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const email = session?.user?.email ?? "";
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<BookingFilter>("All Bookings");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (sessionPending) return;
    if (!email) return;
    const controller = new AbortController();
    fetch(`${apiBaseUrl}/my-booking/${encodeURIComponent(email)}`, {
      credentials: "omit",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok)
          throw new Error(
            (await response.text()) ||
              `Unable to load bookings (${response.status}).`,
          );
        return response.json() as Promise<Booking[]>;
      })
      .then((data) =>
        setBookings(
          Array.isArray(data)
            ? data.map((booking) => ({
                ...booking,
                studio: booking.studio ?? {
                  _id: booking.studioId,
                  title: booking.title,
                  coverImageUrl: booking.coverImageUrl,
                  category: booking.category,
                  address: booking.address,
                  hourlyRate: booking.hourlyRate,
                  securityDeposit: booking.securityDeposit,
                },
              }))
            : [],
        ),
      )
      .catch((loadError) => {
        if (!controller.signal.aborted)
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load bookings.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [email, retry, sessionPending]);

  const counts = useMemo(
    () => ({
      "All Bookings": bookings.length,
      Pending: bookings.filter((booking) => booking.status === "Pending")
        .length,
      Confirmed: bookings.filter((booking) => booking.status === "Confirmed")
        .length,
      Completed: bookings.filter((booking) => booking.status === "Completed")
        .length,
      Cancelled: bookings.filter((booking) => booking.status === "Cancelled")
        .length,
    }),
    [bookings],
  );

  const visibleBookings = useMemo(() => {
    const query = search.trim().toLowerCase();
    return bookings
      .filter((booking) => {
        const searchable =
          `${booking.bookingReference ?? ""} ${booking.studio?.title ?? ""} ${booking.studio?.address ?? ""}`.toLowerCase();
        return (
          (filter === "All Bookings" || booking.status === filter) &&
          (!query || searchable.includes(query))
        );
      })
      .sort((a, b) => {
        const first = new Date(a.createdAt ?? a.date).getTime();
        const second = new Date(b.createdAt ?? b.date).getTime();
        return sort === "newest" ? second - first : first - second;
      });
  }, [bookings, filter, search, sort]);

  function clearFilters() {
    setFilter("All Bookings");
    setSearch("");
  }

  async function cancelBooking() {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      const response = await fetch(
        `${apiBaseUrl}/booking/${encodeURIComponent(cancelTarget._id)}/cancel`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userEmail: email }),
        },
      );
      if (!response.ok)
        throw new Error(
          (await response.json().catch(() => null))?.error ??
            "Unable to cancel booking.",
        );
      setBookings((current) =>
        current.map((booking) =>
          booking._id === cancelTarget._id
            ? { ...booking, status: "Cancelled" }
            : booking,
        ),
      );
      setSelected((current) =>
        current?._id === cancelTarget._id
          ? { ...current, status: "Cancelled" }
          : current,
      );
      setCancelTarget(null);
      toast.add({
        title: "Booking cancelled",
        description: "Booking cancelled successfully.",
        type: "success",
      });
    } catch (cancelError) {
      toast.add({
        title: "Cancellation failed",
        description:
          cancelError instanceof Error
            ? cancelError.message
            : "Please try again.",
        type: "error",
      });
    } finally {
      setCancelling(false);
    }
  }

  if (sessionPending || (Boolean(email) && loading))
    return (
      <main className="min-h-dvh bg-background px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 h-20 animate-pulse rounded-xl bg-secondary" />
          <div className="space-y-3">
            <BookingSkeleton />
            <BookingSkeleton />
            <BookingSkeleton />
          </div>
        </div>
      </main>
    );

  if (!email)
    return (
      <main className="flex min-h-[70dvh] items-center justify-center bg-background px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Please log in to view your bookings
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your studio reservations will appear here after you sign in.
          </p>
          <Link
            href="/login?redirect=/my-bookings"
            className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Log In
          </Link>
        </div>
      </main>
    );

  return (
    <main className="min-h-dvh bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-xl border border-border bg-card px-4 py-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-foreground">My Bookings</span>
        </div>
        <header className="flex flex-col gap-4 py-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              My Bookings
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your studio reservations and track your upcoming sessions.
            </p>
          </div>
          <Link
            href="/studios"
            className="inline-flex w-fit items-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
          >
            +&nbsp; Explore Studios
          </Link>
        </header>
        <section className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card p-2 sm:p-3">
          <div className="flex min-w-0 gap-2 overflow-x-auto pb-1">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition-colors ${filter === item ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
              >
                {item}
                <span className="rounded-full bg-background/70 px-1.5 py-0.5 text-[0.625rem]">
                  {counts[item]}
                </span>
              </button>
            ))}
          </div>
          <div className="flex shrink-0 items-center justify-end gap-2 ml-auto">            
          
            <div className="relative w-fit">
              <select
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value as "newest" | "oldest")
                }
                className="h-9 appearance-none rounded-lg border border-border bg-background py-1 pl-3 pr-8 text-xs font-semibold outline-none focus:border-primary"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
              <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </section>
        <div className="mt-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <strong className="text-foreground">
                {visibleBookings.length}
              </strong>{" "}
              booking{visibleBookings.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        {error ? (
          <div className="mt-4 rounded-xl border border-destructive/30 bg-card px-6 py-12 text-center">
            <h2 className="font-bold text-destructive">
              Unable to load bookings
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <button
              type="button"
              onClick={() => setRetry((value) => value + 1)}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Try Again
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <CalendarDaysIcon className="mx-auto size-10 text-primary" />
            <h2 className="mt-4 text-xl font-bold">No bookings yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              You haven&apos;t booked any creative spaces yet. Find a studio for
              your next project.
            </p>
            <Link
              href="/studios"
              className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Explore Studios
            </Link>
          </div>
        ) : visibleBookings.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <h2 className="font-bold">No bookings found in this category.</h2>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {visibleBookings.map((booking) => (
              <BookingRow
                key={booking._id}
                booking={booking}
                onDetails={() => setSelected(booking)}
                onCancel={() => setCancelTarget(booking)}
              />
            ))}
          </div>
        )}
      </div>
      {selected ? (
        <BookingDetailsModal
          booking={selected}
          onClose={() => setSelected(null)}
          onCancel={() => {
            setSelected(null);
            setCancelTarget(selected);
          }}
        />
      ) : null}
      {cancelTarget ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-booking-title"
        >
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl">
            <h2 id="cancel-booking-title" className="text-lg font-bold">
              Cancel This Booking?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to cancel this reservation? This action
              cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                disabled={cancelling}
                onClick={() => setCancelTarget(null)}
                className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold"
              >
                Keep Booking
              </button>
              <button
                type="button"
                disabled={cancelling}
                onClick={() => void cancelBooking()}
                className="rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground disabled:opacity-60"
              >
                {cancelling ? "Cancelling..." : "Yes, Cancel Booking"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
