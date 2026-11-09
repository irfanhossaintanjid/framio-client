"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  CalendarDaysIcon,
  CalendarIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  Clock3Icon,
  DownloadIcon,
  InfoIcon,
  Loader2Icon,
  MapPinIcon,
  SearchIcon,
  XIcon,
} from "lucide-react"

import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"
import { downloadBookingInvoice } from "@/lib/booking-invoice"
import type { Booking, BookingFilter, BookingRole } from "@/lib/booking-types"

const filters: BookingFilter[] = [
  "All Bookings",
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
]

function money(value?: number | string) {
  const amount = Number(value ?? 0)
  return Number.isFinite(amount)
    ? `$${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
    : "$0"
}

function dateLabel(value?: string) {
  if (!value) return "—"
  const date = new Date(`${value.slice(0, 10)}T00:00:00`)
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
}

function timeLabel(value?: string) {
  if (!value) return "—"
  const [hoursText, minutes = "00"] = value.split(":")
  const hours = Number(hoursText)
  if (!Number.isFinite(hours)) return value
  return `${hours % 12 || 12}:${minutes} ${hours >= 12 ? "PM" : "AM"}`
}

function duration(booking: Booking) {
  if (booking.durationHours) return booking.durationHours
  const start = Number(booking.startTime?.slice(0, 2))
  const end = Number(booking.endTime?.slice(0, 2))
  return Number.isFinite(start) && Number.isFinite(end) ? Math.max(0, end - start) : 0
}

function endTimestamp(booking: Booking) {
  if (booking.endAt) {
    const stored = new Date(booking.endAt).getTime()
    if (Number.isFinite(stored)) return stored
  }
  const fallback = new Date(`${booking.date}T${booking.endTime}:00`).getTime()
  return Number.isFinite(fallback) ? fallback : 0
}

function useCurrentTime() {
  const [currentTime, setCurrentTime] = useState<number | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setCurrentTime(Date.now()), 0)
    const interval = window.setInterval(() => setCurrentTime(Date.now()), 60_000)
    return () => {
      window.clearTimeout(timer)
      window.clearInterval(interval)
    }
  }, [])

  return currentTime
}

function studioId(booking: Booking) {
  if (booking.studioId) return booking.studioId
  const id = booking.studio?._id
  if (typeof id === "string") return id
  return id && "$oid" in id ? id.$oid : ""
}

function normalizeBooking(value: Booking): Booking {
  const booking = {
    ...value,
    status: value.status ?? "Pending",
    studio: value.studio ?? {
      _id: value.studioId,
      title: value.title,
      coverImageUrl: value.coverImageUrl,
      category: value.category,
      address: value.address,
      hourlyRate: value.hourlyRate,
      securityDeposit: value.securityDeposit,
    },
  }

  const scheduledEnd = endTimestamp(booking)
  if (
    booking.status === "Confirmed" &&
    scheduledEnd > 0 &&
    scheduledEnd <= Date.now()
  ) {
    return { ...booking, status: "Completed" }
  }

  return booking
}

function statusStyle(status: Booking["status"]) {
  if (status === "Pending") return "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
  if (status === "Confirmed") return "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300"
  if (status === "Completed") return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
  return "bg-secondary text-muted-foreground"
}

function SkeletonCard() {
  return (
    <div className="grid animate-pulse gap-4 rounded-xl border border-border bg-card p-4 lg:grid-cols-[minmax(210px,1.1fr)_minmax(300px,1.7fr)_190px]">
      <div className="h-28 rounded-lg bg-secondary" />
      <div className="space-y-3">
        <div className="h-4 w-2/3 rounded bg-secondary" />
        <div className="h-3 w-full rounded bg-secondary" />
        <div className="h-10 w-full rounded bg-secondary" />
      </div>
      <div className="h-20 rounded bg-secondary" />
    </div>
  )
}

function Dialog({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  const titleId = title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-5 text-foreground shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-xl font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${title}`}
            className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <XIcon className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function BookingCard({
  booking,
  role,
  busy,
  onConfirm,
  onCancel,
  onCompletionInfo,
  onInvoice,
}: {
  booking: Booking
  role: BookingRole
  busy: boolean
  onConfirm: () => void
  onCancel: () => void
  onCompletionInfo: () => void
  onInvoice: () => void
}) {
  const currentTime = useCurrentTime()
  const id = studioId(booking)
  const hours = duration(booking)
  const isPending = booking.status === "Pending"
  const isConfirmed = booking.status === "Confirmed"
  const isCompleted = booking.status === "Completed"
  const hasNotEnded = currentTime === null || endTimestamp(booking) > currentTime

  return (
    <article className="grid gap-4 rounded-xl border border-border bg-card p-3.5 shadow-sm transition-shadow hover:shadow-md sm:p-4 lg:grid-cols-[minmax(210px,1.1fr)_minmax(300px,1.7fr)_190px] lg:items-center">
      <div className="flex min-w-0 gap-3">
        <div className="relative aspect-[16/10] w-28 shrink-0 overflow-hidden rounded-lg bg-secondary sm:w-36 lg:w-28">
          <Image
            src={booking.studio?.coverImageUrl ?? booking.coverImageUrl ?? "/images/hero/daylight-studio.jpg"}
            alt={`${booking.studio?.title ?? booking.title ?? "Studio"} cover`}
            fill
            unoptimized
            sizes="(max-width: 639px) 112px, 144px"
            className="object-cover"
          />
          <span className="absolute bottom-2 left-2 rounded bg-foreground/85 px-1.5 py-0.5 text-[0.5625rem] font-bold tracking-wide text-background uppercase">
            {booking.studio?.category ?? booking.category ?? "Studio"}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-[0.625rem] font-semibold text-primary">
            #{booking.bookingReference ?? booking._id.slice(-6).toUpperCase()}
          </p>
          <h2 className="mt-1 truncate text-sm font-bold text-foreground">
            {booking.studio?.title ?? booking.title ?? "Studio unavailable"}
          </h2>
          <p className="mt-1 flex items-start gap-1 text-xs text-muted-foreground">
            <MapPinIcon className="mt-0.5 size-3 shrink-0 text-primary" />
            <span className="line-clamp-2">{booking.studio?.address ?? booking.address ?? "Location unavailable"}</span>
          </p>
          {id ? (
            <Link
              href={`/studios/${encodeURIComponent(id)}`}
              className="mt-1 inline-flex text-xs font-medium text-primary hover:underline"
            >
              View Studio →
            </Link>
          ) : null}
          {role === "host" ? (
            <p className="mt-1 truncate text-xs text-muted-foreground">
              Customer: {booking.customerName ?? booking.customerEmail ?? "Unknown"}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-3 text-xs sm:grid-cols-3 sm:border-t-0 sm:pt-0">
        <div>
          <p className="flex items-center gap-1 text-muted-foreground"><CalendarIcon className="size-3" /> Date</p>
          <p className="mt-1 font-semibold">{dateLabel(booking.date)}</p>
        </div>
        <div>
          <p className="flex items-center gap-1 text-muted-foreground"><Clock3Icon className="size-3" /> Time</p>
          <p className="mt-1 font-semibold">{timeLabel(booking.startTime)} – {timeLabel(booking.endTime)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Duration</p>
          <p className="mt-1 font-semibold">{hours} hour{hours === 1 ? "" : "s"}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Hourly Rate</p>
          <p className="mt-1 font-semibold">{money(booking.hourlyRate ?? booking.studio?.hourlyRate)}/hr</p>
        </div>
        <div>
          <p className="text-muted-foreground">Security Deposit</p>
          <p className="mt-1 font-semibold">{money(booking.securityDeposit ?? booking.studio?.securityDeposit)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Total Amount</p>
          <p className="mt-1 text-base font-bold text-primary">{money(booking.totalAmount)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border pt-3 lg:h-full lg:flex-col lg:items-end lg:justify-center lg:border-t-0 lg:border-l lg:pl-4 lg:pt-0">
        <span className={`rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold ${statusStyle(booking.status)}`}>
          {booking.status}
        </span>
        <div className="flex flex-wrap justify-end gap-2">
          {isPending && role === "host" ? (
            <>
              <button type="button" disabled={busy} onClick={onConfirm} className="rounded-md bg-primary px-3 py-1.5 text-[0.6875rem] font-semibold text-primary-foreground disabled:opacity-60">
                Confirm
              </button>
              <button type="button" disabled={busy} onClick={onCancel} className="rounded-md border border-destructive/40 px-3 py-1.5 text-[0.6875rem] font-semibold text-destructive disabled:opacity-60">
                Cancel Booking
              </button>
            </>
          ) : null}
          {isPending && role === "customer" ? (
            <button type="button" disabled={busy} onClick={onCancel} className="rounded-md border border-destructive/40 px-3 py-1.5 text-[0.6875rem] font-semibold text-destructive disabled:opacity-60">
              Cancel Booking
            </button>
          ) : null}
          {isConfirmed && hasNotEnded ? (
            <button type="button" onClick={onCompletionInfo} className="rounded-md bg-emerald-600 px-3 py-1.5 text-[0.6875rem] font-semibold text-white hover:bg-emerald-700">
              Completed
            </button>
          ) : null}
          {isConfirmed || isCompleted ? (
            <button type="button" aria-label="Download PDF receipt" disabled={busy} onClick={onInvoice} className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary px-3 py-1.5 text-[0.6875rem] font-semibold disabled:opacity-60">
              {busy ? <Loader2Icon className="size-3.5 animate-spin" /> : <DownloadIcon className="size-3.5" />}
              Receipt
            </button>
          ) : null}
          {(isCompleted || booking.status === "Cancelled") && id ? (
            <Link href={`/studios/${encodeURIComponent(id)}`} className="rounded-md bg-primary px-3 py-1.5 text-[0.6875rem] font-semibold text-primary-foreground">
              Book Again
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  )
}

function BookingSection({
  title,
  description,
  role,
  bookings,
  busyAction,
  onConfirm,
  onCancel,
  onCompletionInfo,
  onInvoice,
}: {
  title: string
  description: string
  role: BookingRole
  bookings: Booking[]
  busyAction: string | null
  onConfirm: (booking: Booking) => void
  onCancel: (booking: Booking, role: BookingRole) => void
  onCompletionInfo: () => void
  onInvoice: (booking: Booking) => void
}) {
  const [filter, setFilter] = useState<BookingFilter>("All Bookings")
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<"newest" | "oldest">("newest")
  const counts = Object.fromEntries(
    filters.map((status) => [
      status,
      status === "All Bookings"
        ? bookings.length
        : bookings.filter((booking) => booking.status === status).length,
    ]),
  ) as Record<BookingFilter, number>
  const query = search.trim().toLowerCase()
  const visible = bookings
    .filter((booking) => {
      const searchable = `${booking.bookingReference ?? ""} ${booking.studio?.title ?? booking.title ?? ""} ${booking.studio?.address ?? booking.address ?? ""} ${booking.customerName ?? ""} ${booking.customerEmail ?? ""}`.toLowerCase()
      return (
        (filter === "All Bookings" || booking.status === filter) &&
        (!query || searchable.includes(query))
      )
    })
    .sort((a, b) => {
      const first = new Date(a.createdAt ?? a.date).getTime()
      const second = new Date(b.createdAt ?? b.date).getTime()
      return sort === "newest" ? second - first : first - second
    })

  return (
    <section className="mt-8">
      <header className="mb-4">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </header>
      <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-2 sm:p-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 gap-2 overflow-x-auto pb-1">
          {filters.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              aria-pressed={filter === status}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold ${filter === status ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
            >
              {status}
              <span className="rounded-full bg-background/70 px-1.5 py-0.5 text-[0.625rem]">{counts[status]}</span>
            </button>
          ))}
        </div>
        <div className="flex shrink-0 items-center justify-between gap-2 lg:justify-end">
          <label className="relative flex min-w-0 items-center">
            <SearchIcon className="pointer-events-none absolute left-2.5 size-3.5 text-muted-foreground" />
            <span className="sr-only">Search {title}</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search"
              className="h-9 w-32 rounded-lg border border-border bg-background pl-8 pr-2 text-xs outline-none focus:border-primary sm:w-44"
            />
          </label>
          <div className="relative w-fit">
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as "newest" | "oldest")}
              aria-label={`Sort ${title}`}
              className="h-9 appearance-none rounded-lg border border-border bg-background py-1 pl-3 pr-8 text-xs font-semibold outline-none focus:border-primary"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>
      <p className="mt-5 text-sm text-muted-foreground">
        Showing <strong className="text-foreground">{visible.length}</strong> booking{visible.length === 1 ? "" : "s"}
      </p>
      {visible.length ? (
        <div className="mt-4 space-y-3">
          {visible.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              role={role}
              busy={busyAction === `confirm:${booking._id}` || busyAction === `cancel:${booking._id}` || busyAction === `invoice:${booking._id}`}
              onConfirm={() => onConfirm(booking)}
              onCancel={() => onCancel(booking, role)}
              onCompletionInfo={onCompletionInfo}
              onInvoice={() => onInvoice(booking)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <CalendarDaysIcon className="mx-auto size-9 text-primary" />
          <h3 className="mt-3 font-bold">{bookings.length ? "No bookings in this status" : "No bookings yet"}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {role === "host" ? "New booking requests for your studios will appear here." : "Your studio reservations will appear here after you book a space."}
          </p>
        </div>
      )}
    </section>
  )
}

export function MyBookingsPage() {
  const { data: session, isPending: sessionPending } = authClient.useSession()
  const email = session?.user?.email ?? ""
  const [reservations, setReservations] = useState<Booking[]>([])
  const [requests, setRequests] = useState<Booking[]>([])
  const [hasStudios, setHasStudios] = useState(false)
  const [loading, setLoading] = useState(true)
  const [customerError, setCustomerError] = useState<string | null>(null)
  const [hostError, setHostError] = useState<string | null>(null)
  const [retry, setRetry] = useState(0)
  const [dialog, setDialog] = useState<{ type: "confirm" | "cancel" | "confirmed" | "completion"; booking?: Booking; role?: BookingRole } | null>(null)
  const [busyAction, setBusyAction] = useState<string | null>(null)
  const loadingRef = useRef(false)

  const loadBookings = useCallback(async (showLoader = true) => {
    if (sessionPending || !email || loadingRef.current) return
    loadingRef.current = true
    if (showLoader) setLoading(true)
    setCustomerError(null)
    setHostError(null)
    try {
      const load = async (scope: "customer" | "host") => {
        const response = await fetch(`/api/bookings?scope=${scope}`, {
          credentials: "include",
          cache: "no-store",
        })
        const data = await response.json().catch(() => null)
        if (!response.ok) {
          if (scope === "host" && response.status === 404) {
            throw new Error(
              "The booking server is missing its host-requests endpoint. Restart Framio-server using the current source.",
            )
          }
          throw new Error(
            data?.error ??
              data?.message ??
              `The booking service returned HTTP ${response.status}.`,
          )
        }
        if (!Array.isArray(data)) throw new Error("The bookings response was invalid.")
        return {
          bookings: (data as Booking[]).map(normalizeBooking),
          hasStudios: scope === "host" && response.headers.get("x-framio-has-studios") === "true",
        }
      }

      const [customerResult, hostResult] = await Promise.allSettled([
        load("customer"),
        load("host"),
      ])

      if (customerResult.status === "fulfilled") {
        setReservations(customerResult.value.bookings)
      } else {
        setCustomerError(
          customerResult.reason instanceof Error
            ? customerResult.reason.message
            : "Unable to load reservations.",
        )
      }

      if (hostResult.status === "fulfilled") {
        setRequests(hostResult.value.bookings)
        setHasStudios(hostResult.value.hasStudios)
      } else {
        setHostError(
          hostResult.reason instanceof Error
            ? hostResult.reason.message
            : "Unable to load booking requests.",
        )
      }
    } finally {
      loadingRef.current = false
      if (showLoader) setLoading(false)
    }
  }, [email, sessionPending])

  useEffect(() => {
    const timer = window.setTimeout(() => void loadBookings(), 0)
    const refresh = () => {
      if (document.visibilityState === "visible") void loadBookings(false)
    }
    const interval = window.setInterval(refresh, 60_000)
    document.addEventListener("visibilitychange", refresh)
    return () => {
      window.clearTimeout(timer)
      window.clearInterval(interval)
      document.removeEventListener("visibilitychange", refresh)
    }
  }, [loadBookings, retry])

  async function changeStatus(action: "confirm" | "cancel") {
    const booking = dialog?.booking
    if (!booking || busyAction) return
    setBusyAction(`${action}:${booking._id}`)
    try {
      const response = await fetch(`/api/bookings/${encodeURIComponent(booking._id)}/${action}`, {
        method: "PATCH",
        credentials: "include",
      })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.error ?? data?.message ?? `Unable to ${action} booking.`)
      const updated = normalizeBooking(data as Booking)
      setReservations((items) => items.map((item) => item._id === updated._id ? updated : item))
      setRequests((items) => items.map((item) => item._id === updated._id ? updated : item))
      if (action === "confirm") {
        setDialog({ type: "confirmed", booking: updated })
        toast.add({ title: "Booking confirmed", description: "The reservation is now confirmed.", type: "success" })
      } else {
        setDialog(null)
        toast.add({ title: "Booking cancelled", description: "The booking status is now Cancelled.", type: "success" })
      }
    } catch (operationError) {
      toast.add({
        title: action === "confirm" ? "Confirmation failed" : "Cancellation failed",
        description: operationError instanceof Error ? operationError.message : "Please try again.",
        type: "error",
      })
    } finally {
      setBusyAction(null)
    }
  }

  async function downloadInvoice(booking: Booking) {
    if (busyAction || !["Confirmed", "Completed"].includes(booking.status)) return
    setBusyAction(`invoice:${booking._id}`)
    try {
      const response = await fetch(`/api/bookings/${encodeURIComponent(booking._id)}/invoice`, {
        credentials: "include",
        cache: "no-store",
      })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.error ?? data?.message ?? "Unable to prepare invoice.")
      await downloadBookingInvoice(normalizeBooking(data as Booking))
      toast.add({ title: "Invoice downloaded", description: "Your Framio invoice is ready.", type: "success" })
    } catch (invoiceError) {
      toast.add({
        title: "Invoice unavailable",
        description: invoiceError instanceof Error ? invoiceError.message : "Please try again.",
        type: "error",
      })
    } finally {
      setBusyAction(null)
    }
  }

  if (sessionPending || (email && loading)) {
    return (
      <main className="min-h-dvh bg-background px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-3">
          <div className="mb-8 h-20 animate-pulse rounded-xl bg-secondary" />
          <SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
      </main>
    )
  }

  if (!email) {
    return (
      <main className="flex min-h-[70dvh] items-center justify-center bg-background px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Please log in to view your bookings</h1>
          <p className="mt-2 text-sm text-muted-foreground">Your studio reservations will appear here after you sign in.</p>
          <Link href="/login?redirect=/my-bookings" className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Log In</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-dvh bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-xl border border-border bg-card px-4 py-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary">Home</Link><span className="mx-2">/</span><span className="font-semibold text-foreground">My Bookings</span>
        </div>
        <header className="flex flex-col gap-4 py-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">My Bookings</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage your studio reservations and track your upcoming sessions.</p>
          </div>
          <Link href="/studios" className="inline-flex w-fit items-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">+&nbsp; Explore Studios</Link>
        </header>

        {reservations.length > 0 || !hasStudios || customerError ? (
          customerError ? (
            <div className="mt-8 rounded-xl border border-destructive/30 bg-card px-6 py-10 text-center">
              <InfoIcon className="mx-auto size-8 text-destructive" />
              <h2 className="mt-3 font-bold text-destructive">Unable to load your reservations</h2>
              <p className="mt-2 text-sm text-muted-foreground">{customerError}</p>
              <button type="button" onClick={() => setRetry((value) => value + 1)} className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Retry</button>
            </div>
          ) : (
            <BookingSection
              title="My Reservations"
              description="Reservations you created for creative spaces on Framio."
              role="customer"
              bookings={reservations}
              busyAction={busyAction}
              onConfirm={(booking) => setDialog({ type: "confirm", booking })}
              onCancel={(booking, role) => setDialog({ type: "cancel", booking, role })}
              onCompletionInfo={() => setDialog({ type: "completion" })}
              onInvoice={(booking) => void downloadInvoice(booking)}
            />
          )
        ) : null}
        {requests.length > 0 || hostError ? (
          hostError ? (
            <div className="mt-8 rounded-xl border border-destructive/30 bg-card px-6 py-10 text-center">
              <InfoIcon className="mx-auto size-8 text-destructive" />
              <h2 className="mt-3 font-bold text-destructive">Unable to load booking requests</h2>
              <p className="mt-2 text-sm text-muted-foreground">{hostError}</p>
              <button type="button" onClick={() => setRetry((value) => value + 1)} className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Retry</button>
            </div>
          ) : (
            <BookingSection
              title="Booking Requests"
              description="Incoming reservations for studios you own."
              role="host"
              bookings={requests}
              busyAction={busyAction}
              onConfirm={(booking) => setDialog({ type: "confirm", booking })}
              onCancel={(booking, role) => setDialog({ type: "cancel", booking, role })}
              onCompletionInfo={() => setDialog({ type: "completion" })}
              onInvoice={(booking) => void downloadInvoice(booking)}
            />
          )
        ) : null}
      </div>

      {dialog?.type === "confirm" && dialog.booking ? (
        <Dialog title="Confirm This Booking?" onClose={() => busyAction ? undefined : setDialog(null)}>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Confirming this reservation lets the customer know their studio booking is approved.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-secondary p-3 text-xs">
            <div className="col-span-2"><p className="text-muted-foreground">Studio</p><p className="mt-1 font-semibold">{dialog.booking.studio?.title ?? dialog.booking.title ?? "Studio"}</p></div>
            <div><p className="text-muted-foreground">Customer</p><p className="mt-1 font-semibold">{dialog.booking.customerName ?? dialog.booking.customerEmail ?? "Customer"}</p></div>
            <div><p className="text-muted-foreground">Booking date</p><p className="mt-1 font-semibold">{dateLabel(dialog.booking.date)}</p></div>
            <div><p className="text-muted-foreground">Time</p><p className="mt-1 font-semibold">{timeLabel(dialog.booking.startTime)} – {timeLabel(dialog.booking.endTime)}</p></div>
            <div><p className="text-muted-foreground">Total amount</p><p className="mt-1 font-semibold text-primary">{money(dialog.booking.totalAmount)}</p></div>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button type="button" disabled={Boolean(busyAction)} onClick={() => setDialog(null)} className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold">Keep Pending</button>
            <button type="button" disabled={Boolean(busyAction)} onClick={() => void changeStatus("confirm")} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
              {busyAction ? <Loader2Icon className="size-4 animate-spin" /> : null}{busyAction ? "Confirming..." : "Confirm"}
            </button>
          </div>
        </Dialog>
      ) : null}

      {dialog?.type === "cancel" && dialog.booking ? (
        <Dialog title="Cancel This Booking?" onClose={() => busyAction ? undefined : setDialog(null)}>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Are you sure you want to cancel this reservation? This action will update the booking status to Cancelled.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <button type="button" disabled={Boolean(busyAction)} onClick={() => setDialog(null)} className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold">Keep Booking</button>
            <button type="button" disabled={Boolean(busyAction)} onClick={() => void changeStatus("cancel")} className="inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground disabled:opacity-60">
              {busyAction ? <Loader2Icon className="size-4 animate-spin" /> : null}{busyAction ? "Cancelling..." : "Yes, Cancel Booking"}
            </button>
          </div>
        </Dialog>
      ) : null}

      {dialog?.type === "confirmed" && dialog.booking ? (
        <Dialog title="Booking Confirmed!" onClose={() => setDialog(null)}>
          <div className="mt-5 flex flex-col items-center text-center">
            <CheckCircle2Icon className="size-12 text-emerald-600" />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Your reservation has been successfully confirmed. The booking details are now available for reference.
            </p>
            <p className="mt-3 text-xs font-semibold text-primary">#{dialog.booking.bookingReference ?? dialog.booking._id}</p>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" disabled={Boolean(busyAction)} onClick={() => void downloadInvoice(dialog.booking!)} className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-semibold disabled:opacity-60">
              {busyAction ? <Loader2Icon className="size-4 animate-spin" /> : <DownloadIcon className="size-4" />}Download PDF Invoice
            </button>
            <button type="button" onClick={() => setDialog(null)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Confirmed</button>
          </div>
        </Dialog>
      ) : null}

      {dialog?.type === "completion" ? (
        <Dialog title="Booking Completion" onClose={() => setDialog(null)}>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            This reservation is confirmed. Its status will update to Completed automatically after the scheduled end time.
          </p>
          <div className="mt-5 flex justify-end">
            <button type="button" onClick={() => setDialog(null)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Got It</button>
          </div>
        </Dialog>
      ) : null}
    </main>
  )
}
