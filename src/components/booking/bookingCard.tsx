"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRightIcon,
  Clock3Icon,
  InfoIcon,
  Loader2Icon,
  XIcon,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { ToastMessage } from "@/components/toast-message";
import { formatMoney, numberValue, studioId } from "@/lib/studio-details";
import type { StudioDetails } from "@/lib/types/page";

export function BookingCard({ studio }: { studio: StudioDetails }) {
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
  const hourlyAmount = rate * hours;
  const total = hourlyAmount + deposit;
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
      return toast.info(<ToastMessage title="Your own listing" description="You cannot book your own studio." />);
    if (!session) {
      toast.info(<ToastMessage title="Please log in" description="Please log in to book this space." />);
      router.push(
        `/login?redirect=/studios/${encodeURIComponent(studioId(studio))}`,
      );
      return;
    }
    if (hours < minHours)
      return toast.error(<ToastMessage title="Choose a longer booking" description={`This studio requires at least ${minHours} hours.`} />);
    setOpen(true);
  }
  async function confirmBooking() {
    setSubmitting(true);
    try {
      const endAt = new Date(`${date}T${end}:00`).toISOString();
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          studioId: studioId(studio),
          date,
          startTime: start,
          endTime: end,
          endAt,
        }),
      });
      const responseData = await response.json().catch(() => null);
      if (response.status === 409) {
        setOpen(false);
        throw new Error(
          responseData?.error ??
            responseData?.message ??
            "This time slot is already reserved. Choose another date or time.",
        );
      }
      if (response.status === 401) {
        toast.error(<ToastMessage title="Session expired" description="Please log in again." />);
        router.push(
          `/login?redirect=/studios/${encodeURIComponent(studioId(studio))}`,
        );
        return;
      }
      if (!response.ok)
        throw new Error(responseData?.error ?? responseData?.message ?? "Booking failed.");
      toast.success(<ToastMessage title="Booking confirmed!" description="Your workspace reservation is confirmed." />);
      setOpen(false);
      router.push("/my-bookings");
    } catch (error) {
      toast.error(<ToastMessage title="Booking failed" description={error instanceof Error ? error.message : "Please try again."} />);
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <>
    <div className="">
      <section
        id="booking-card"
        className="mx-auto w-full max-w-md max-h-140 rounded-xl border border-border bg-card p-4 shadow-lg lg:sticky lg:top-20"
      >
        <div className="flex items-end justify-between">
          <p className="text-2xl font-bold text-foreground">
            {formatMoney(rate)}
            <span className="text-xs font-medium text-muted-foreground">
              {" "}
              / hour
            </span>
          </p>
          <span className="rounded-full bg-secondary px-2 py-1 text-[0.5625rem] font-semibold text-primary">
            {minHours} hrs min booking
          </span>
        </div>
        <div className="mt-4 space-y-3">
          <label className="block text-xs font-semibold text-foreground">
            Production Date
            <input
              type="date"
              min={tomorrow}
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="mt-1.5 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground"
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
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
                className="mt-1.5 h-9 w-full rounded-lg border border-border bg-background px-2 text-xs"
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
                className="mt-1.5 h-9 w-full rounded-lg border border-border bg-background px-2 text-xs"
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
          <div className="flex items-center justify-between rounded-lg bg-secondary px-2.5 py-1.5 text-[0.6875rem]">
            <span>
              <Clock3Icon className="mr-1 inline size-3" /> Total Reserved
              Duration
            </span>
            <strong>{hours} Hours Production Hold</strong>
          </div>
          <div className="space-y-1.5 border-t border-border pt-2.5 text-[0.6875rem] text-muted-foreground">
            <div className="flex justify-between">
              <span>
                {formatMoney(rate)} × {hours} hrs
              </span>
              <span>{formatMoney(hourlyAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>
                Security Deposit (Escrow) <InfoIcon className="inline size-3" />
              </span>
              <span>{formatMoney(deposit)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2.5 text-sm font-bold text-foreground">
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
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-xs font-bold text-primary-foreground hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {owner ? "Your Own Listing" : "Book Workspace Now"}
            <ArrowRightIcon className="size-4" />
          </button>
          <p className="text-center text-[0.625rem] text-muted-foreground">
            Your reservation is confirmed immediately. No payment is collected here.
          </p>
          {/* <div className="flex justify-center gap-3 text-[0.625rem] font-semibold text-muted-foreground">
            <span>◉ Free cancellation (48h)</span>
            <span>◉ $1M Insurance</span>
          </div> */}
        </div>
      </section>
      </div>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-dialog-title"
        >
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-4 shadow-2xl">
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
            <p className="mt-3 text-sm font-semibold">{studio.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {date} · {displayTime(start)} – {displayTime(end)} · {hours} hours
            </p>
            <div className="mt-3 space-y-2 border-t border-border pt-3 text-sm">
              <div className="flex justify-between">
                <span>Hourly cost</span>
                <span>{formatMoney(hourlyAmount)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatMoney(total)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatMoney(deposit)} refundable escrow is held separately.
              </p>
            </div>
            <div className="mt-4 flex gap-2">
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
                {submitting ? <><Loader2Icon className="mr-2 inline size-4 animate-spin" aria-hidden="true" />Submitting…</> : "Confirm Request"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
