import { auth, db } from "@/lib/auth"
import { getStudiosWithSavedState } from "@/lib/wishlist-server"

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
