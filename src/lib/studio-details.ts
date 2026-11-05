export type StudioId = string | { $oid: string }

export type StudioDetails = {
  _id: StudioId
  title?: string
  tagline?: string
  hourlyRate?: string | number
  securityDeposit?: string | number
  minimumDuration?: string | number
  crewCapacity?: string | number
  squareFootage?: string | number
  address?: string
  coverImageUrl?: string
  galleryImages?: string[]
  description?: string
  category?: string
  amenities?: string[]
  rating?: string | number
  ownerName?: string
  ownerEmail?: string
  ownerPhoto?: string
  createdAt?: string
}

export type StudioReview = {
  _id?: string
  userName?: string
  userPhoto?: string
  rating: number
  comment: string
  createdAt?: string
  ratings?: {
    cleanliness?: number
    communication?: number
    gear?: number
    acoustics?: number
  }
}

export const amenityGroups = [
  { title: "Lighting & Electric Power", icon: "zap", items: ["Pre-lit Overhead Grid", "3-Phase Camlock (100A+)", "Profoto Strobe Package", "DMX Lighting Console", "C-Stands & Sandbags (12x)", "Aputure Electro Storm 2600x"] },
  { title: "Facilities & Stage Access", icon: "building", items: ["Drive-In Roll Up Door", "Ground Floor Loading Dock", "Dedicated HMU Vanity (3)", "Private Dressing Rooms", "Client Mezzanine Lounge", "Commercial Kitchen On-Site"] },
  { title: "Acoustics & Audio Suitability", icon: "volume", items: ["Acoustic Baffles / Dampened", "Whisper-Quiet Dual HVAC", "Isolated Vocal Booth"] },
  { title: "Comfort, Tech & Crew Hospitality", icon: "wifi", items: ["1 Gbps Fiber WiFi Symmetrical", "Espresso & Craft Service Bar", "Central Climate (Heating & A/C)", "Restrooms with Shower"] },
] as const

export function studioId(studio: StudioDetails) {
  return typeof studio._id === "string" ? studio._id : studio._id.$oid
}

export function numberValue(value: string | number | undefined, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function formatMoney(value: string | number | undefined) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(numberValue(value))
}

export function cityFromAddress(address?: string) {
  if (!address) return "United States"
  const parts = address.split(",").map((part) => part.trim()).filter(Boolean)
  return parts.length > 1 ? parts[parts.length - 2] : parts[0]
}

export function studioTypeLabel(category?: string) {
  const labels: Record<string, string> = {
    "Photo Studio": "Photography Studio", "Film Stage": "Cinema Sound Stage", "Podcast Lounge": "Podcast & Audio Lounge",
    "Daylight Loft": "Natural-Light Loft", "Music Suite": "Recording Suite", "Art Workshop": "Art & Craft Studio",
    Warehouse: "Industrial Warehouse", "Other Stage": "Flexible Stage",
  }
  return labels[category ?? ""] ?? category ?? "Creative Studio"
}

export function galleryForStudio(studio: StudioDetails) {
  return [studio.coverImageUrl, ...(studio.galleryImages ?? [])].filter((image): image is string => Boolean(image))
}
