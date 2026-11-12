import { auth } from "@/lib/auth"

export async function getServerBearerToken(request: Request) {
  const origin = request.headers.get("origin")
  if (
    ["POST", "PATCH", "DELETE"].includes(request.method) &&
    origin &&
    origin !== new URL(request.url).origin
  ) {
    return Response.json({ error: "Cross-origin requests are not allowed." }, { status: 403 })
  }

  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) {
      return Response.json({ error: "You must be signed in to continue." }, { status: 401 })
    }

    const result = await auth.api.getToken({ headers: request.headers })
    if (!result?.token) {
      return Response.json({ error: "Your session is invalid or expired." }, { status: 401 })
    }

    return `Bearer ${result.token}`
  } catch {
    return Response.json({ error: "Your session is invalid or expired." }, { status: 401 })
  }
}

export function isAuthError(value: string | Response): value is Response {
  return value instanceof Response
}
