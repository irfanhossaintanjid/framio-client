import { Suspense } from "react"
import { ExploreStudios } from "@/components/studios/explore-studios"

export default function StudiosPage() {
  return <Suspense fallback={<div className="min-h-dvh bg-background" />}><ExploreStudios /></Suspense>
}
