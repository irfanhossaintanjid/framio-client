import type { Metadata } from "next"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { StudioDetailsClient } from "@/components/studio-details/studio-details-client"
import { auth } from "@/lib/auth"
import { getSavedStudioIds } from "@/lib/wishlist-server"
import type { StudioDetails } from "@/lib/types/page"

const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
).replace(/\/+$/, "")


async function getStudio(id: string, includeSaved = false) {
  const response = await fetch(
    `${apiBaseUrl}/studio/${encodeURIComponent(id)}`,
  )

  if (response.status === 400 || response.status === 404) notFound()
  if (!response.ok) {
    throw new Error(`Unable to load studio (${response.status}).`)
  }

  const studio = (await response.json()) as StudioDetails
  if (!includeSaved) return studio

  const session = await auth.api.getSession({ headers: await headers() })
  const userEmail = session?.user?.email
  if (!userEmail) return { ...studio, isSaved: false }

  const savedIds = await getSavedStudioIds(userEmail)
  return { ...studio, isSaved: savedIds.has(id) }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const studio = await getStudio((await params).id, true)

  return {
    title: studio.title ?? "Studio Details",
    description: studio.tagline ?? studio.description,
  }
}

export default async function StudioDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const studio = await getStudio((await params).id)
  return <StudioDetailsClient studio={studio} />
}
