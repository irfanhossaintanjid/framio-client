"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useStudioId } from "@/components/studio/studio-id-context"
import { authClient } from "@/lib/auth-client"
import { toast } from "@/components/ui/toast"
import { LoadingSpinner } from "@/components/ui/spinner"
import {
  AudioLinesIcon,
  Building2Icon,
  CameraIcon,
  CheckIcon,
  ClapperboardIcon,
  EllipsisIcon,
  LockKeyholeIcon,
  Mic2Icon,
  PaletteIcon,
  StoreIcon,
  SunIcon,
  WifiIcon,
  Volume2Icon,
  ZapIcon,
} from "lucide-react"



const categories = [
  { label: "Photo Studio", Icon: CameraIcon },
  { label: "Film Stage", Icon: ClapperboardIcon },
  { label: "Podcast Lounge", Icon: Mic2Icon },
  { label: "Daylight Loft", Icon: SunIcon },
  { label: "Music Suite", Icon: AudioLinesIcon },
  { label: "Art Workshop", Icon: PaletteIcon },
  { label: "Warehouse", Icon: Building2Icon },
  { label: "Other Stage", Icon: EllipsisIcon },
]

const amenityGroups = [
  {
    title: "Lighting & Electric Power",
    Icon: ZapIcon,
    items: [
      { label: "Pre-lit Overhead Grid", checked: true },
      { label: "3-Phase Camlock (100A+)", checked: false },
      { label: "Profoto Strobe Package", checked: false },
      { label: "DMX Lighting Console", checked: false },
      { label: "C-Stands & Sandbags (12x)", checked: false },
      { label: "Aputure Electro Storm 2600x", checked: false },
    ],
  },
  {
    title: "Facilities & Stage Access",
    Icon: Building2Icon,
    items: [
      { label: "Drive-In Roll Up Door", checked: false },
      { label: "Ground Floor Loading Dock", checked: false },
      { label: "Dedicated HMU Vanity (3)", checked: false },
      { label: "Private Dressing Rooms", checked: false },
      { label: "Client Mezzanine Lounge", checked: false },
      { label: "Commercial Kitchen On-Site", checked: false },
    ],
  },
  {
    title: "Acoustics & Audio Suitability",
    Icon: Volume2Icon,
    items: [
      { label: "Acoustic Baffles / Dampened", checked: false },
      { label: "Whisper-Quiet Dual HVAC", checked: false },
      { label: "Isolated Vocal Booth", checked: false },
    ],
  },
  {
    title: "Comfort, Tech & Crew Hospitality",
    Icon: WifiIcon,
    items: [
      { label: "1 Gbps Fiber WiFi Symmetrical", checked: false },
      { label: "Espresso & Craft Service Bar", checked: false },
      { label: "Central Climate (Heating & A/C)", checked: false },
      { label: "Restrooms with Shower", checked: false },
    ],
  },
]

const fieldClassName =
  "h-10 w-full min-w-0 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"

const helperClassName = "mt-1.5 text-xs leading-relaxed text-muted-foreground"
const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_URL ?? " "
).replace(/\/+$/, "")

function Field({
  id,
  label,
  required = false,
  helper,
  children,
}: {
  id: string
  label: string
  required?: boolean
  helper?: string
  children: React.ReactNode
}) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-foreground"
      >
        {label}
        {required ? <span className="text-primary"> *</span> : null}
      </label>
      {children}
      {helper ? <p className={helperClassName}>{helper}</p> : null}
    </div>
  )
}

function SectionHeader({
  letter,
  title,
  description,
  badge,
}: {
  letter: string
  title: string
  description: string
  badge: string
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          {letter}
        </span>
        <div>
          <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
            {title}
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {description}
          </p>
        </div>
      </div>
      <span className="ml-11 inline-flex shrink-0 items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary sm:ml-0">
        {badge}
      </span>
    </div>
  )
}



function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border/80 bg-card p-4 shadow-[0_4px_18px_-12px_rgba(16,42,67,0.28)] sm:p-6">
      {children}
    </section>
  )
}

function LockedHostField({
  id,
  label,
  value,
}: {
  id: string
  label: string
  value: string
}) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-semibold text-muted-foreground"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          value={value}
          readOnly
          className={`${fieldClassName} cursor-not-allowed bg-secondary/60 pr-10 text-sm`}
        />
        <LockKeyholeIcon
          className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

type Studio = {
  _id: string
  title?: string
  category?: string
  tagline?: string
  hourlyRate?: string | number
  securityDeposit?: string | number
  minimumDuration?: string | number
  crewCapacity?: string | number
  squareFootage?: string | number
  address?: string
  coverImageUrl?: string
  amenities?: string[]
  description?: string
  hostName?: string
  hostEmail?: string
}

export default function AddStudioForm() {
  const router = useRouter()
  const studioId = useStudioId()
  const { data: session } = authClient.useSession()
  const [studio, setStudio] = useState<Studio | null>(null)
  const [isLoading, setIsLoading] = useState(Boolean(studioId))
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("Photo Studio")
  const [coverUrl, setCoverUrl] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!studioId) return

    const listingId = studioId
    const controller = new AbortController()
    async function loadStudio() {
      try {
        const response = await fetch(
          `${apiBaseUrl}/studio/${encodeURIComponent(listingId)}`,
          { credentials: "omit", signal: controller.signal },
        )

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Please sign in to edit this studio.")
          }
          if (response.status === 404) {
            throw new Error("This studio was not found or you cannot edit it.")
          }
          throw new Error(`Unable to load studio (${response.status}).`)
        }

        const listing = (await response.json()) as Studio
        setStudio(listing)
        setSelectedCategory(listing.category ?? "Photo Studio")
        setCoverUrl(listing.coverImageUrl ?? "")
        setPreviewUrl(listing.coverImageUrl ?? "")
      } catch (error) {
        if (controller.signal.aborted) return
        console.error("Failed to load studio:", error)
        setLoadError(
          error instanceof Error ? error.message : "Unable to load this studio.",
        )
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    void loadStudio()
    return () => controller.abort()
  }, [studioId])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const amenities = formData.getAll("amenities").map(String)
    formData.delete("amenities")
    const studioData = {
      ...Object.fromEntries(formData.entries()),
      category: selectedCategory,
      amenities,
    }

    try {
      const res = await fetch(
        studioId
          ? `${apiBaseUrl}/studio/${encodeURIComponent(studioId)}`
          : `${apiBaseUrl}/add-studios`,
        {
          method: studioId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "omit",
          body: JSON.stringify(studioData),
        },
      )
      const responseText = await res.text()

      if (!res.ok) {
        throw new Error(
          responseText ||
            `Studio ${studioId ? "update" : "creation"} failed (${res.status}).`,
        )
      }

      toast.add({
        title: `Studio ${studioId ? "updated" : "created"}`,
        description: `Your studio was ${studioId ? "updated" : "created"} successfully.`,
        type: "success",
      })
      router.push("/my-listings")
    } catch (error) {
      console.error(`Failed to ${studioId ? "update" : "create"} studio:`, error)
      toast.add({
        title: `Unable to ${studioId ? "update" : "create"} studio`,
        description: error instanceof Error ? error.message : "Please try again.",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background px-4 text-foreground">
        <LoadingSpinner size="lg" label="Loading studio details" />
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-4 text-center text-foreground">
        <p role="alert" className="text-sm text-destructive">
          {loadError}
        </p>
        {loadError.includes("sign in") ? (
          <Link
            className="text-sm font-semibold text-primary underline"
            href="/login"
          >
            Go to login
          </Link>
        ) : null}
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-background px-3 py-5 text-foreground sm:px-6 sm:py-8">
      <header className="mx-auto mb-4 w-full max-w-5xl">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {studioId ? "Update Studio" : "List a New Creative Studio"}
        </h1>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {studioId
            ? "Update your production stage, cyc wall, podcast lounge, or creative loft listing."
            : "Publish your production stage, cyc wall, podcast lounge, or creative loft to verified creators worldwide."}{" "}
          <span aria-hidden="true">•</span> Auto-saved draft
        </p>
      </header>
      <form
        className="mx-auto flex w-full max-w-5xl flex-col gap-4 sm:gap-5"
        onSubmit={handleSubmit}
      >
        <Card>
          <div className="mb-4 flex justify-end">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
              <LockKeyholeIcon className="size-3.5" aria-hidden="true" />
              Read-Only Host Account
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <LockedHostField
              id="host-name"
              label="Host Full Name"
              value={studio?.hostName ?? session?.user.name ?? ""}
            />
            <LockedHostField
              id="host-email"
              label="Host Email Address"
              value={studio?.hostEmail ?? session?.user.email ?? ""}
            />
          </div>
        </Card>

        <Card>
          <SectionHeader
            letter="A"
            title="Basic Details & Category"
            description="Define your studio classification and headline presence"
            badge="Primary Meta"
          />
          <div className="space-y-5">
            <Field
              id="studio-title"
              label="Studio Title"
              required
              helper="Use a descriptive name including architectural or equipment perks."
            >
              <input
                id="studio-title"
                name="title"
                type="text"
                defaultValue={studio?.title ?? ""}
                className={fieldClassName}
                required
              />
            </Field>

            <fieldset aria-required="true">
              <legend className="mb-2 text-sm font-semibold text-foreground">
                Studio Space Category <span className="text-primary">*</span>
              </legend>
              <div className="grid grid-cols-4 gap-2">
                {categories.map(({ label, Icon }) => {
                  const selected = selectedCategory === label
                  return (
                    <button
                      key={label}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setSelectedCategory(label)}
                      className={`flex min-h-[76px] flex-col items-center justify-center gap-2 rounded-xl border px-1.5 py-3 text-center text-[11px] font-medium leading-tight transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 sm:text-xs ${
                        selected
                          ? "border-primary bg-primary/8 text-primary"
                          : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:bg-secondary/50"
                      }`}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      {label}
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <Field
              id="studio-tagline"
              label="Catchy Tagline / Subtitle"
              helper="Visible directly under Studio title on search index cards (max 120 characters)."
            >
              <input
                id="studio-tagline"
                name="tagline"
                type="text"
                maxLength={120}
                defaultValue={studio?.tagline ?? ""}
                className={fieldClassName}
              /> 
            </Field>
          </div>
        </Card>

        <Card>
          <h2 className="mb-5 text-base font-bold tracking-tight text-foreground sm:text-lg">
            Pricing & Capacity
          </h2>
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                id="hourly-rate"
                label="Hourly Base Rate ($/hr)"
                required
                helper="Recommended: $85–$120/hr based on Downtown LA district averages"
              >
                <div className="relative">
                  <input
                    id="hourly-rate"
                    name="hourlyRate"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={studio?.hourlyRate ?? ""}
                    className={`${fieldClassName} pr-16`}
                  />
                  <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                    /hour
                  </span>
                </div>
              </Field>
              <Field
                id="security-deposit"
                label="Escrow Security Deposit ($)"
                helper="Held safely in Framio escrow during booking, released post-wrap"
              >
                <input
                  id="security-deposit"
                  name="securityDeposit"
                  type="number"
                  min="0"
                  step="0.01" 
                  defaultValue={studio?.securityDeposit ?? ""}
                  className={fieldClassName}
                />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="minimum-duration" label="Minimum Booking Duration">
                <select
                  id="minimum-duration"
                  name="minimumDuration"
                  defaultValue={String(studio?.minimumDuration ?? "1")}
                  className={fieldClassName}
                >
                  <option value="1">1 Hour Minimum</option>
                  <option value="2">2 Hours Minimum</option>
                  <option value="4">4 Hours Minimum</option>
                  <option value="8">8 Hours Minimum</option>
                </select>
              </Field>
             <Field
  id="crew-capacity"
  label="Maximum Crew & Cast Capacity"
  helper="Total simultaneous people authorized on site"
>
  <div className="relative">
    <input
      id="crew-capacity"
      name="crewCapacity"
      type="number"
      min="0"
      step="0"
      required
      defaultValue={studio?.crewCapacity ?? "00"}
      className={fieldClassName}
    />
  </div>
</Field>
            </div>
            <Field id="square-footage" label="Total Usable Square Footage">
              <div className="relative">
                <input
                  id="square-footage"
                  name="squareFootage"
                  defaultValue={studio?.squareFootage ?? ""}
                 
                  className={`${fieldClassName} pr-16`}
                />
                <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                  sq ft
                </span>
              </div>
            </Field>
          </div>
        </Card>

        <Card>
          <SectionHeader
            letter="C"
            title="Location & Physical Loading Access"
            description="Precise logistics ensure frictionless crew arrival on shoot days"
            badge="Geo-verified"
          />
          <div className="space-y-5">
            <Field
              id="street-address"
              label="Location Address"
              required
              helper="Exact unit details are kept private until booking confirmation."
            >
              <input
                id="street-address"
                name="address"
                defaultValue={studio?.address ?? ""}
               
                className={fieldClassName}
                required
              />
            </Field>
          </div>
        </Card>

        <Card>
          <SectionHeader
            letter="D"
            title="Media & Photography Showcase"
            description="High-resolution imagery converts 3.4x more film & photo bookings"
            badge="4 Images Added"
          />
          <Field id="cover-image-url" label="Primary Cover Image URL" required>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id="cover-image-url"
                name="coverImageUrl"
                type="url"
                value={coverUrl}
                onChange={(event) => setCoverUrl(event.target.value)}
                className={fieldClassName}
                required
              />
              <button
                type="button"
                onClick={() => setPreviewUrl(coverUrl)}
                className="h-10 shrink-0 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30"
              >
                Update Preview
              </button>
            </div>
          </Field>
          {previewUrl ? (
          <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-xl border border-border bg-secondary sm:aspect-[16/6]">
            
              <Image
                src={previewUrl}
                alt="Preview of the studio's primary cover photo"
                fill
                unoptimized
                sizes="(max-width: 640px) 100vw, 896px"
                className="object-cover"
              />
           
            <span className="absolute top-3 right-3 rounded-full bg-foreground/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              Live Preview
            </span>
            <span className="absolute bottom-3 left-3 rounded-md bg-foreground/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
              Primary Cover Photo
            </span>
          </div>
           ) : null}
        </Card>

        <Card>
          <SectionHeader
            letter="E"
            title="Amenities & Production Gear Matrix"
            description="Help production managers confirm technical suitability at a glance"
            badge="Optional"
          />
          <div className="grid gap-5 md:grid-cols-2">
            {amenityGroups.map(({ title, Icon, items }) => (
              <fieldset key={title}>
                <legend className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wide text-foreground uppercase">
                  <Icon className="size-4 text-primary" aria-hidden="true" />
                  {title}
                </legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {items.map(({ label, checked }) => (
                    <label
                      key={label}
                      className="flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-2 text-xs leading-snug text-foreground transition-colors hover:border-primary/50"
                    >
                      <input
                        type="checkbox"
                        name="amenities"
                        value={label}
                        defaultChecked={
                          studio?.amenities
                            ? studio.amenities.includes(label)
                            : checked
                        }
                        className="peer sr-only"
                      />
                      <span className="flex size-4 shrink-0 items-center justify-center rounded border border-border text-transparent peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30">
                        <CheckIcon className="size-3" aria-hidden="true" />
                      </span>
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader
            letter="F"
            title="Detailed Space Overview & Description"
            description="Detailed information regarding acoustics, lighting conditions, and stage guidelines,"
            badge="Overview & Rules"
          />
          <Field
            id="studio-narrative"
            label="Studio Narrative & Architectural Features"
            required
            helper="Comprehensive descriptions increase verified production bookings by over 45%."
          >
            <textarea
              id="studio-narrative"
              name="description"
              defaultValue={studio?.description ?? ""}
             
              
              className={`${fieldClassName} h-auto min-h-40 resize-y py-2.5 leading-relaxed`}
              required
            />
          </Field>
        </Card>

        <div className="border-t border-border/80 pt-7">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={(event) => {
                event.currentTarget.form?.reset()
                setSelectedCategory(studio?.category ?? "Photo Studio")
                setCoverUrl(studio?.coverImageUrl ?? "")
                setPreviewUrl(studio?.coverImageUrl ?? "")
              }}
              className="h-10 rounded-lg bg-secondary px-5 text-xs font-medium text-primary transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-6 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <StoreIcon className="size-4" aria-hidden="true" />
              {isSubmitting
                ? studioId
                  ? <><LoadingSpinner size="sm" label="Saving studio" className="text-primary-foreground" /> Saving...</>
                  : <><LoadingSpinner size="sm" label="Creating studio" className="text-primary-foreground" /> Creating...</>
                : studioId
                  ? "Save Changes"
                  : "Create Studio"}
            </button>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Please review your studio details before publishing. New listings
            undergo automated standard check before appearing on Framio&apos;s
            marketplace.
          </p>
        </div>
      </form>
    </div>
  )
}
