import type { StudioDetails } from "@/lib/types/page"

export const bookingStatuses = [
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
] as const

export type BookingStatus = (typeof bookingStatuses)[number]
export type BookingFilter = "All Bookings" | BookingStatus

export type Booking = {
  _id: string
  bookingReference?: string
  invoiceNumber?: string
  studioId: string
  date: string
  startTime: string
  endTime: string
  startAt?: string
  endAt?: string
  durationHours?: number
  hourlyRate?: number | string
  hourlyAmount?: number | string
  securityDeposit?: number | string
  totalAmount?: number | string
  title?: string
  coverImageUrl?: string
  category?: string
  address?: string
  status: BookingStatus
  customerName?: string
  customerEmail?: string
  ownerName?: string
  ownerEmail?: string
  createdAt?: string
  confirmedAt?: string
  completedAt?: string
  cancelledAt?: string
  studio?: Partial<StudioDetails> | null
}
