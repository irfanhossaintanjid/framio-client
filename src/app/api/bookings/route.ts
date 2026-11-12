import {
  forwardBookingRequest,
  getBookingAuth,
  isBookingResponse,
} from "@/lib/booking-api-server"

export async function GET(request: Request) {
  const authContext = await getBookingAuth(request)
  if (isBookingResponse(authContext)) return authContext

  return forwardBookingRequest(authContext, "/my-booking", { method: "GET" })
}

export async function POST(request: Request) {
  const authContext = await getBookingAuth(request)
  if (isBookingResponse(authContext)) return authContext

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid booking request body." }, { status: 400 })
  }

  return forwardBookingRequest(authContext, "/booking", {
    method: "POST",
    body,
  })
}
