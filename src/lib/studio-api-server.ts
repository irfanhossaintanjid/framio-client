import { auth } from "@/lib/auth"

const studioServerUrl = (
  process.env.FRAMIO_SERVER_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000"
).replace(/\/+$/, "")

export type StudioAuth = {
  email: string
  name: string
  image: string
}

export async function getStudioAuth(request: Request): Promise<StudioAuth | Response> {
  if (!process.env.FRAMIO_INTERNAL_API_SECRET) {
    return Response.json({ error: "Studio services are not configured." }, { status: 503 })
  }

  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user?.email) {
    return Response.json({ error: "Please sign in to manage studios." }, { status: 401 })
  }

  return {
    email: session.user.email,
    name: session.user.name ?? "",
    image: session.user.image ?? "",
  }
}

export function isStudioAuthResponse(value: StudioAuth | Response): value is Response {
  return value instanceof Response
}

export async function forwardStudioRequest(
  user: StudioAuth,
  path: string,
  method: "GET" | "POST" | "PATCH" | "DELETE",
  body?: unknown,
) {
  try {
    const response = await fetch(`${studioServerUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-framio-internal-secret": process.env.FRAMIO_INTERNAL_API_SECRET ?? "",
        "x-framio-user-email": user.email,
        "x-framio-user-name": user.name,
        "x-framio-user-image": user.image,
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      cache: "no-store",
    })
    const responseBody = await response.text()
    return new Response(responseBody, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" },
    })
  } catch (error) {
    console.error("Studio API request failed:", error)
    return Response.json({ error: "The studio service is temporarily unavailable." }, { status: 502 })
  }
}
