import {
  forwardBookingRequest,
  getBookingAuth,
  isBookingResponse,
} from "@/lib/booking-api-server"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authContext = await getBookingAuth(request)
  if (isBookingResponse(authContext)) return authContext

  const { id } = await params
  return forwardBookingRequest(
    authContext,
    `/booking/${encodeURIComponent(id)}/confirm`,
    { method: "PATCH" },
  )
}
