import { auth } from "@/lib/auth"

const bookingServerUrl = (
  process.env.FRAMIO_SERVER_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000"
).replace(/\/+$/, "")

export type BookingAuth = {
  email: string
  name: string
}

export async function getBookingAuth(
  request: Request,
): Promise<BookingAuth | Response> {
  if (!process.env.FRAMIO_INTERNAL_API_SECRET) {
    return Response.json(
      {
        error:
          "Booking services are not configured. Set FRAMIO_INTERNAL_API_SECRET on the client and server.",
      },
      { status: 503 },
    )
  }

  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user?.email) {
    return Response.json(
      { error: "You must be signed in to manage bookings." },
      { status: 401 },
    )
  }

  return {
    email: session.user.email,
    name: session.user.name ?? "",
  }
}

export function isBookingResponse(value: BookingAuth | Response): value is Response {
  return value instanceof Response
}

export async function forwardBookingRequest(
  authContext: BookingAuth,
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
        "x-framio-internal-secret": process.env.FRAMIO_INTERNAL_API_SECRET ?? "",
        "x-framio-user-email": authContext.email,
        "x-framio-user-name": authContext.name,
      },
      ...(init.body === undefined ? {} : { body: JSON.stringify(init.body) }),
      cache: "no-store",
    })
    const responseBody = await response.text()
    const responseHeaders = new Headers({
      "Content-Type": response.headers.get("Content-Type") ?? "application/json",
    })
    const hasStudios = response.headers.get("x-framio-has-studios")
    if (hasStudios !== null) {
      responseHeaders.set("x-framio-has-studios", hasStudios)
    }

    return new Response(responseBody, {
      status: response.status,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error("Booking API request failed:", error)
    return Response.json(
      { error: "The booking service is temporarily unavailable." },
      { status: 502 },
    )
  }
}
