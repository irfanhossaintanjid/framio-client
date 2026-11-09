import {
  forwardBookingRequest,
  getBookingAuth,
  isBookingResponse,
} from "@/lib/booking-api-server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authContext = await getBookingAuth(request)
  if (isBookingResponse(authContext)) return authContext

  const { id } = await params
  return forwardBookingRequest(
    authContext,
    `/booking/${encodeURIComponent(id)}/invoice`,
    { method: "GET" },
  )
}
