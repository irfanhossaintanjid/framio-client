import { Suspense } from "react"
import { ExploreStudios } from "@/components/studios/explore-studios"
import { PageLoading } from "@/components/ui/page-loading"

export default function StudiosPage() {
  return <Suspense fallback={<PageLoading label="Loading studios" />}><ExploreStudios /></Suspense>
}
