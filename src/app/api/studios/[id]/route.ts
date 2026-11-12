import { ObjectId } from "mongodb"

import { auth, db } from "@/lib/auth"
import { getStudiosWithSavedState } from "@/lib/wishlist-server"
import { forwardStudioRequest, getStudioAuth, isStudioAuthResponse } from "@/lib/studio-api-server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: request.headers })
  const userEmail = session?.user?.email
  if (!userEmail) return Response.json({ error: "Please sign in to edit this studio." }, { status: 401 })

  const { id } = await params
  if (!ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid studio ID" }, { status: 400 })
  }

  try {
    const studio = await db.collection("studios").findOne({ _id: new ObjectId(id) })
    if (!studio) {
      return Response.json({ error: "Studio not found" }, { status: 404 })
    }
    if (studio.ownerEmail?.trim().toLowerCase() !== userEmail.trim().toLowerCase()) {
      return Response.json({ error: "Studio not found" }, { status: 404 })
    }

    const [result] = await getStudiosWithSavedState([studio], userEmail)
    return Response.json(result)
  } catch (error) {
    console.error("Failed to load studio:", error)
    return Response.json({ error: "Unable to load studio" }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getStudioAuth(request)
  if (isStudioAuthResponse(user)) return user

  const { id } = await params
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid studio request body." }, { status: 400 })
  }

  return forwardStudioRequest(user, `/studio/${encodeURIComponent(id)}`, "PATCH", body)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getStudioAuth(request)
  if (isStudioAuthResponse(user)) return user

  const { id } = await params
  return forwardStudioRequest(user, `/studio/${encodeURIComponent(id)}`, "DELETE")
}
