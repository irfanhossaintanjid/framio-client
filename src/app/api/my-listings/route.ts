import {
  forwardStudioRequest,
  getStudioAuth,
  isStudioAuthResponse,
} from "@/lib/studio-api-server"

export async function GET(request: Request) {
  const user = await getStudioAuth(request)
  if (isStudioAuthResponse(user)) return user

  return forwardStudioRequest(
    user,
    "/my-studios",
    "GET",
  )
}
