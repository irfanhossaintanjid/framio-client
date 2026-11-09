import { auth } from "@/lib/auth"
import {
  isValidStudioId,
  removeSavedStudio,
} from "@/lib/wishlist-server"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ studioId: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    const userEmail = session?.user?.email?.trim().toLowerCase() ?? null
    if (!userEmail) {
      return Response.json({ error: "Authentication required" }, { status: 401 })
    }

    const { studioId } = await params
    if (!isValidStudioId(studioId)) {
      return Response.json({ error: "A valid studio ID is required" }, { status: 400 })
    }

    await removeSavedStudio(userEmail, studioId)
    return Response.json({ saved: false })
  } catch (error) {
    console.error("Failed to remove saved studio:", error)
    return Response.json({ error: "Unable to remove saved studio" }, { status: 500 })
  }
}
