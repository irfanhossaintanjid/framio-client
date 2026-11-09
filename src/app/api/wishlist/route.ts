import { ObjectId } from "mongodb"

import { auth, db } from "@/lib/auth"
import {
  getSavedStudios,
  isValidStudioId,
  saveStudio,
} from "@/lib/wishlist-server"

async function getUserEmail(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  return session?.user?.email?.trim().toLowerCase() ?? null
}

export async function GET(request: Request) {
  try {
    const userEmail = await getUserEmail(request)
    if (!userEmail) {
      return Response.json({ error: "Authentication required" }, { status: 401 })
    }

    return Response.json(await getSavedStudios(userEmail))
  } catch (error) {
    console.error("Failed to load wishlist:", error)
    return Response.json({ error: "Unable to load saved studios" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const userEmail = await getUserEmail(request)
    if (!userEmail) {
      return Response.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = (await request.json().catch(() => null)) as { studioId?: unknown } | null
    const studioId = typeof body?.studioId === "string" ? body.studioId.trim() : ""
    if (!isValidStudioId(studioId)) {
      return Response.json({ error: "A valid studio ID is required" }, { status: 400 })
    }

    const studio = await db.collection("studios").findOne({
      _id: new ObjectId(studioId),
    })
    if (!studio) {
      return Response.json({ error: "Studio not found" }, { status: 404 })
    }

    const result = await saveStudio(userEmail, studioId)
    return Response.json({ saved: true, created: result.created })
  } catch (error) {
    console.error("Failed to save studio:", error)
    return Response.json({ error: "Unable to save studio" }, { status: 500 })
  }
}
