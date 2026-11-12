import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth)

export async function GET(request: Request) {
  if (new URL(request.url).pathname.endsWith("/token")) {
    return Response.json({ error: "Not found" }, { status: 404 })
  }

  return handlers.GET(request)
}

export const { POST } = handlers
