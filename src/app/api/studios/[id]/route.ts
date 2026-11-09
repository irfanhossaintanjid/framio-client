import { ObjectId } from "mongodb"

import { auth, db } from "@/lib/auth"
import { getStudiosWithSavedState } from "@/lib/wishlist-server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  if (!ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid studio ID" }, { status: 400 })
  }

  try {
    const studio = await db.collection("studios").findOne({ _id: new ObjectId(id) })
    if (!studio) {
      return Response.json({ error: "Studio not found" }, { status: 404 })
    }

    const session = await auth.api.getSession({ headers: request.headers })
    const userEmail = session?.user?.email ?? null
    const [result] = await getStudiosWithSavedState([studio], userEmail)
    return Response.json(result)
  } catch (error) {
    console.error("Failed to load studio:", error)
    return Response.json({ error: "Unable to load studio" }, { status: 500 })
  }
}
