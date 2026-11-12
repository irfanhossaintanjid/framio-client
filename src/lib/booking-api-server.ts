import { getServerBearerToken, isAuthError } from "@/lib/server-auth"

const bookingServerUrl = (
  process.env.FRAMIO_SERVER_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000"
).replace(/\/+$/, "")

export type BookingAuth = string

export async function getBookingAuth(
  request: Request,
): Promise<BookingAuth | Response> {
  const authorization = await getServerBearerToken(request)
  if (isAuthError(authorization)) return authorization

  return authorization
}

export function isBookingResponse(value: BookingAuth | Response): value is Response {
  return value instanceof Response
}

export async function forwardBookingRequest(
  authorization: BookingAuth,
  path: string,
  init: {
    method: "GET" | "POST" | "PATCH"
    body?: unknown
  },
) {
  try {
    const response = await fetch(`${bookingServerUrl}${path}`, {
      method: init.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      ...(init.body === undefined ? {} : { body: JSON.stringify(init.body) }),
      cache: "no-store",
    })
    const responseBody = await response.text()
    return new Response(responseBody, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") ?? "application/json",
      },
    })
  } catch (error) {
    console.error("Booking API request failed:", error)
    return Response.json(
      { error: "The booking service is temporarily unavailable." },
      { status: 502 },
    )
  }
}

