import type { Metadata } from "next"

import { AddStudioForm } from "@/components/studio/add-studio-form"

export const metadata: Metadata = {
  title: "Add New Studio",
  description: "Create a new studio listing on Framio.",
}

export default function AddStudioPage() {
  return <AddStudioForm />
}
