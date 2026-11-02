"use client"

import * as React from "react"
import {
  CalendarDaysIcon,
  CheckIcon,
  ClockIcon,
  MapPinIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react"

import { StudioVisual } from "@/components/studio-visual"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/toast"
import type { Studio } from "@/lib/studios"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const startTimes = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
] as const

const durations = ["2", "3", "4", "6", "8"] as const

type BookingErrors = Partial<Record<"date" | "name" | "email", string>>

function BookingForm({
  studio,
  onBooked,
}: {
  studio: Studio
  onBooked: () => void
}) {
  const [date, setDate] = React.useState("")
  const [start, setStart] = React.useState<string>("10:00")
  const [duration, setDuration] = React.useState<string>("3")
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [errors, setErrors] = React.useState<BookingErrors>({})

  function clearError(field: keyof BookingErrors) {
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: BookingErrors = {}

    if (!date) {
      nextErrors.date = "Choose a date for your session."
    }

    if (!name.trim()) {
      nextErrors.name = "Enter the name for this booking."
    }

    if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = "Enter a valid email address."
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setErrors({})
    toast.add({
      title: "Booking request sent",
      description: `${studio.name} · ${date} at ${start} for ${duration} hours. We'll email ${email.trim()} to confirm.`,
      type: "success",
    })
    onBooked()
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div>
        <h3 className="font-heading text-base font-semibold">Book this studio</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          ${studio.price} per hour · {studio.responseTime} response
        </p>
      </div>

      <FieldGroup className="gap-4">
        <Field data-invalid={Boolean(errors.date)}>
          <FieldLabel htmlFor="booking-date">
            Date
            <span aria-hidden="true" className="text-destructive">
              *
            </span>
          </FieldLabel>
          <Input
            id="booking-date"
            type="date"
            value={date}
            onChange={(event) => {
              setDate(event.target.value)
              clearError("date")
            }}
            aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? "booking-date-error" : undefined}
          />
          {errors.date ? (
            <FieldError id="booking-date-error">{errors.date}</FieldError>
          ) : null}
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="booking-start">Start time</FieldLabel>
            <Select
              value={start}
              onValueChange={(value) => setStart((value as string) ?? "10:00")}
            >
              <SelectTrigger id="booking-start" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {startTimes.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="booking-duration">Duration</FieldLabel>
            <Select
              value={duration}
              onValueChange={(value) => setDuration((value as string) ?? "3")}
            >
              <SelectTrigger id="booking-duration" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {durations.map((hours) => (
                  <SelectItem key={hours} value={hours}>
                    {hours} hours
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field data-invalid={Boolean(errors.name)}>
          <FieldLabel htmlFor="booking-name">
            Full name
            <span aria-hidden="true" className="text-destructive">
              *
            </span>
          </FieldLabel>
          <Input
            id="booking-name"
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              clearError("name")
            }}
            placeholder="Alex Rivera"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "booking-name-error" : undefined}
          />
          {errors.name ? (
            <FieldError id="booking-name-error">{errors.name}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={Boolean(errors.email)}>
          <FieldLabel htmlFor="booking-email">
            Email
            <span aria-hidden="true" className="text-destructive">
              *
            </span>
          </FieldLabel>
          <Input
            id="booking-email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              clearError("email")
            }}
            placeholder="you@studio.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "booking-email-error" : undefined}
          />
          {errors.email ? (
            <FieldError id="booking-email-error">{errors.email}</FieldError>
          ) : (
            <FieldDescription>
              We only share your email with the studio host.
            </FieldDescription>
          )}
        </Field>
      </FieldGroup>

      <Button type="submit" className="w-full">
        {studio.instant ? "Book instantly" : "Request booking"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        No charge today. You can reschedule up to 48 hours before your session.
      </p>
    </form>
  )
}

export function StudioDetailsDialog({
  studio,
  open,
  onOpenChange,
}: {
  studio: Studio | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open && Boolean(studio)} onOpenChange={onOpenChange}>
      {studio ? (
        <DialogContent className="max-h-[92vh] overflow-y-auto p-0 sm:max-w-3xl">
          <div className="grid gap-0 md:grid-cols-[1.05fr_1fr]">
            <div className="flex flex-col gap-4 p-5">
              <StudioVisual
                discipline={studio.discipline}
                className="h-40 w-full rounded-lg"
              />

              <DialogHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{studio.discipline}</Badge>
                  <Badge variant={studio.instant ? "success" : "warning"}>
                    {studio.instant ? "Instant book" : "Request to book"}
                  </Badge>
                </div>
                <DialogTitle className="text-xl font-semibold">
                  {studio.name}
                </DialogTitle>
                <DialogDescription className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="inline-flex items-center gap-1">
                    <MapPinIcon className="size-3.5" aria-hidden="true" />
                    {studio.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <StarIcon
                      className="size-3.5 fill-highlight text-highlight"
                      aria-hidden="true"
                    />
                    {studio.rating.toFixed(1)} ({studio.reviews} reviews)
                  </span>
                </DialogDescription>
              </DialogHeader>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {studio.description}
              </p>

              <Separator />

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-secondary p-3">
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <UsersIcon className="size-3.5" aria-hidden="true" />
                    Capacity
                  </p>
                  <p className="mt-1 font-medium">
                    Up to {studio.capacity} people
                  </p>
                </div>
                <div className="rounded-lg bg-secondary p-3">
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <ClockIcon className="size-3.5" aria-hidden="true" />
                    Host
                  </p>
                  <p className="mt-1 font-medium">{studio.host}</p>
                </div>
              </div>

              <div>
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  <CalendarDaysIcon className="size-4" aria-hidden="true" />
                  What&apos;s included
                </p>
                <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                  {studio.amenities.map((amenity) => (
                    <li key={amenity} className="flex items-start gap-2">
                      <CheckIcon
                        className="mt-0.5 size-3.5 shrink-0 text-success"
                        aria-hidden="true"
                      />
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-border bg-muted/40 p-5 md:border-t-0 md:border-l">
              <BookingForm
                key={`${studio.id}-${open ? "open" : "closed"}`}
                studio={studio}
                onBooked={() => onOpenChange(false)}
              />
            </div>
          </div>
        </DialogContent>
      ) : null}
    </Dialog>
  )
}
