import AddStudioPage from "@/app/add-studio/page"
import { StudioIdProvider } from "@/components/studio/studio-id-context"

export default async function EditStudioPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <StudioIdProvider studioId={id}>
      <AddStudioPage />
    </StudioIdProvider>
  )
}
