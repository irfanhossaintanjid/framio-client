import { auth } from "@/lib/auth"

const maxImageSize = 10 * 1024 * 1024

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) {
    return Response.json({ error: "Please sign in to upload an image." }, { status: 401 })
  }

  const apiKey = process.env.IMGBB_API_KEY
  if (!apiKey) {
    return Response.json({ error: "Image uploads are not configured." }, { status: 503 })
  }

  try {
    const formData = await request.formData()
    const image = formData.get("image")
    if (!(image instanceof File)) {
      return Response.json({ error: "Choose an image to upload." }, { status: 400 })
    }
    if (!image.type.startsWith("image/")) {
      return Response.json({ error: "The selected file must be an image." }, { status: 400 })
    }
    if (image.size > maxImageSize) {
      return Response.json({ error: "Choose an image smaller than 10 MB." }, { status: 413 })
    }

    const uploadData = new FormData()
    uploadData.set("image", image)
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      { method: "POST", body: uploadData },
    )
    const result = await response.json().catch(() => null)
    const imageUrl = result?.data?.url
    if (!response.ok || typeof imageUrl !== "string") {
      return Response.json({ error: "Image upload failed. Please try again." }, { status: 502 })
    }

    return Response.json({ url: imageUrl })
  } catch (error) {
    console.error("Image upload failed:", error)
    return Response.json({ error: "Image upload failed. Please try again." }, { status: 502 })
  }
}
