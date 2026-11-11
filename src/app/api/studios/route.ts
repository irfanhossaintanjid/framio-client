import { auth, db } from "@/lib/auth"
import { getStudiosWithSavedState } from "@/lib/wishlist-server"
import { forwardStudioRequest, getStudioAuth, isStudioAuthResponse } from "@/lib/studio-api-server"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const requestedLimit = Number.parseInt(url.searchParams.get("limit") ?? "", 10)
    const query = db.collection("studios").find()
    const studios = Number.isInteger(requestedLimit) && requestedLimit > 0
      ? await query.sort({ rating: -1, createdAt: -1 }).limit(requestedLimit).toArray()
      : await query.toArray()

    const session = await auth.api.getSession({ headers: request.headers })
    const userEmail = session?.user?.email ?? null
    return Response.json(await getStudiosWithSavedState(studios, userEmail))
  } catch (error) {
    console.error("Failed to load studios:", error)
    return Response.json({ error: "Unable to load studios" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const user = await getStudioAuth(request)
  if (isStudioAuthResponse(user)) return user

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid studio request body." }, { status: 400 })
  }

  return forwardStudioRequest(user, "/add-studios", "POST", body)
}
