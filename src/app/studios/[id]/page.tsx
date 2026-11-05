import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { StudioDetailsClient } from "@/components/studio-details/studio-details-client"
import type { StudioDetails } from "@/lib/studio-details"



async function getStudio(id: string) {
  const response = await fetch(`http://localhost:8000/studio/${id}`);

  if (response.status === 400 || response.status === 404) notFound()
  if (!response.ok) {
    throw new Error(`Unable to load studio (${response.status}).`)
  }

  return (await response.json()) as StudioDetails
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const studio = await getStudio((await params).id)

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
