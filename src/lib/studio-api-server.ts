import { getServerBearerToken, isAuthError } from "@/lib/server-auth"

const studioServerUrl = (
  process.env.FRAMIO_SERVER_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000"
).replace(/\/+$/, "")

export async function getStudioAuth(request: Request): Promise<string | Response> {
  const authorization = await getServerBearerToken(request)
  if (isAuthError(authorization)) return authorization
  return authorization
}

export function isStudioAuthResponse(value: string | Response): value is Response {
  return value instanceof Response
}

export async function forwardStudioRequest(
  authorization: string,
  path: string,
  method: "GET" | "POST" | "PATCH" | "DELETE",
  body?: unknown,
) {
  try {
    const response = await fetch(`${studioServerUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
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

