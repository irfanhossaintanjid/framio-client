import jsPDF from "jspdf"

import type { Booking } from "@/lib/booking-types"

function money(value?: number | string) {
  const amount = Number(value ?? 0)
  return Number.isFinite(amount) ? `$${amount.toFixed(2)}` : "$0.00"
}

function dateLabel(value?: string) {
  if (!value) return "Not provided"
  const parsed = new Date(`${value.slice(0, 10)}T00:00:00`)
  return Number.isNaN(parsed.getTime())
    ? value
    : parsed.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
}

function timeLabel(value?: string) {
  if (!value) return "Not provided"
  const [hours, minutes = "00"] = value.split(":")
  const hour = Number(hours)
  if (!Number.isFinite(hour)) return value
  return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? "PM" : "AM"}`
}

function durationLabel(booking: Booking) {
  if (booking.durationHours) {
    return `${booking.durationHours} hour${booking.durationHours === 1 ? "" : "s"}`
  }
  const start = Number(booking.startTime?.slice(0, 2))
  const end = Number(booking.endTime?.slice(0, 2))
  const duration = Math.max(0, end - start)
  return `${duration} hour${duration === 1 ? "" : "s"}`
}

async function imageDataUrl(source: string) {
  const response = await fetch(source)
  if (!response.ok) throw new Error("Logo unavailable")
  const blob = await response.blob()
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error("Logo could not be read"))
    reader.readAsDataURL(blob)
  })
}

function sectionTitle(document: jsPDF, title: string, y: number) {
  document.setFillColor(20, 108, 148)
  document.roundedRect(40, y - 12, 515, 24, 5, 5, "F")
  document.setTextColor(255, 255, 255)
  document.setFont("helvetica", "bold")
  document.setFontSize(10)
  document.text(title, 52, y + 4)
  document.setTextColor(28, 40, 52)
  return y + 38
}

function field(
  document: jsPDF,
  label: string,
  value: string,
  x: number,
  y: number,
) {
  document.setFont("helvetica", "bold")
  document.setFontSize(8)
  document.setTextColor(111, 125, 137)
  document.text(label.toUpperCase(), x, y)
  document.setFont("helvetica", "normal")
  document.setFontSize(10)
  document.setTextColor(28, 40, 52)
  document.text(value, x, y + 14, { maxWidth: 230 })
}

export async function downloadBookingInvoice(booking: Booking) {
  const invoiceNumber =
    booking.invoiceNumber ??
    `INV-${booking.bookingReference ?? booking._id.slice(-8).toUpperCase()}`
  const document = new jsPDF({ unit: "pt", format: "a4" })

  document.setFillColor(7, 21, 33)
  document.rect(0, 0, 595, 118, "F")
  try {
    const logo = await imageDataUrl("/images/framio-logo-badge-180.png")
    document.addImage(logo, "PNG", 40, 28, 48, 48)
  } catch {
    // The text lockup remains a valid Framio invoice if the optional logo fails.
  }
  document.setTextColor(255, 255, 255)
  document.setFont("helvetica", "bold")
  document.setFontSize(24)
  document.text("FRAMIO", 102, 58)
  document.setFont("helvetica", "normal")
  document.setFontSize(10)
  document.text("Creative space booking invoice", 102, 77)
  document.setFont("helvetica", "bold")
  document.setFontSize(20)
  document.text("INVOICE", 425, 55)
  document.setFont("helvetica", "normal")
  document.setFontSize(9)
  document.text(invoiceNumber, 425, 73)
  document.text(`Generated ${new Date().toLocaleDateString("en-US")}`, 425, 89)

  let y = 158
  y = sectionTitle(document, "Customer Information", y)
  field(document, "Name", booking.customerName ?? "Not provided", 52, y)
  field(document, "Email", booking.customerEmail ?? "Not provided", 305, y)

  y += 62
  y = sectionTitle(document, "Host Information", y)
  field(document, "Name", booking.ownerName ?? "Not provided", 52, y)
  field(document, "Email", booking.ownerEmail ?? "Not provided", 305, y)

  y += 62
  y = sectionTitle(document, "Studio Information", y)
  field(
    document,
    "Studio",
    booking.studio?.title ?? booking.title ?? "Not provided",
    52,
    y,
  )
  field(document, "Category", booking.studio?.category ?? booking.category ?? "Not provided", 305, y)
  y += 48
  field(
    document,
    "Location",
    booking.studio?.address ?? booking.address ?? "Not provided",
    52,
    y,
  )

  y += 62
  y = sectionTitle(document, "Booking Information", y)
  field(document, "Date", dateLabel(booking.date), 52, y)
  field(
    document,
    "Time",
    `${timeLabel(booking.startTime)} – ${timeLabel(booking.endTime)}`,
    305,
    y,
  )
  y += 48
  field(document, "Duration", durationLabel(booking), 52, y)
  field(document, "Hourly rate", `${money(booking.hourlyRate)} / hour`, 305, y)

  y += 62
  y = sectionTitle(document, "Payment Summary", y)
  const rows = [
    ["Hourly cost", money(booking.hourlyAmount ?? Number(booking.hourlyRate ?? 0) * Number(booking.durationHours ?? 0))],
    ["Security deposit", money(booking.securityDeposit)],
    ["Total amount", money(booking.totalAmount)],
  ]
  document.setFontSize(10)
  rows.forEach(([label, value], index) => {
    const rowY = y + index * 25
    document.setFont("helvetica", index === rows.length - 1 ? "bold" : "normal")
    document.setTextColor(28, 40, 52)
    document.text(label, 52, rowY)
    document.text(value, 480, rowY, { align: "right" })
    if (index < rows.length - 1) {
      document.setDrawColor(225, 231, 235)
      document.line(52, rowY + 9, 543, rowY + 9)
    }
  })

  document.setDrawColor(225, 231, 235)
  document.line(40, 760, 555, 760)
  document.setFont("helvetica", "bold")
  document.setFontSize(9)
  document.setTextColor(20, 108, 148)
  document.text(`Booking status: ${booking.status}`, 40, 782)
  document.setFont("helvetica", "normal")
  document.setTextColor(111, 125, 137)
  document.text("Thank you for creating with Framio.", 40, 801)
  document.text("Framio · Book the studio that makes it real.", 40, 817)

  document.save(`${invoiceNumber}.pdf`)
}
